/**
 * Healthcare data importer.
 *
 * Source files (data/raw, data/verified)
 *      -> normalise + validate   (scripts/lib/normalize.ts)
 *      -> duplicate detection
 *      -> upsert into PostgreSQL  (idempotent, keyed on slug)
 *      -> DataEvidence rows       (field-level traceability)
 *      -> VerificationTask rows   (the manual follow-up queue)
 *      -> report
 *
 * Safe to re-run: every write is an upsert on a natural key, so a second run
 * updates rather than duplicating.
 *
 * Usage:  npm run db:import
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { PrismaClient } from "@prisma/client";

import { createPrismaClient } from "./lib/db.ts";
import {
  findCrossSourceDuplicates,
  findDuplicateCandidates,
  normalizeCmchisHospital,
  normalizeHospital,
  type NormalizedHospital,
  type ValidationIssue,
} from "./lib/normalize.ts";

const ROOT = process.cwd();
const COLLECTED_AT = new Date("2026-08-28T00:00:00Z");
/** Healthcare data goes stale; schedule a re-check six months out. */
const NEXT_REVIEW = new Date("2027-02-28T00:00:00Z");

interface RawFile {
  source: {
    key?: string;
    id?: string;
    name: string;
    organization: string;
    sourceType: string;
    url?: string;
    reliability?: string;
    authoritativeFor?: string;
    notes?: string;
  };
  records: Record<string, unknown>[];
}

function readJson(relativePath: string): RawFile {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8")) as RawFile;
}

/* --------------------------------- catalogue -------------------------------- */

/**
 * The facility catalogue mirrors app/data/facilities.ts. It is reference data,
 * not a claim about any hospital, so it is safe to seed directly.
 */
const FACILITIES = [
  { key: "emergency_department", name: "Emergency Department", category: "Critical care", emergencyRelevant: true },
  { key: "icu", name: "ICU", category: "Critical care", emergencyRelevant: true },
  { key: "hdu", name: "HDU", category: "Critical care", emergencyRelevant: true },
  { key: "trauma_care", name: "Trauma Care", category: "Critical care", emergencyRelevant: true },
  { key: "ventilator", name: "Ventilator", category: "Critical care", emergencyRelevant: true },
  { key: "operation_theatre", name: "Operation Theatre", category: "Critical care", emergencyRelevant: true },
  { key: "nicu", name: "NICU", category: "Critical care", emergencyRelevant: true },
  { key: "picu", name: "PICU", category: "Critical care", emergencyRelevant: true },
  { key: "blood_bank", name: "Blood Bank", category: "Support services", emergencyRelevant: true },
  { key: "blood_storage", name: "Blood Storage", category: "Support services", emergencyRelevant: true },
  { key: "platelet_support", name: "Platelet Support", category: "Support services", emergencyRelevant: true },
  { key: "ambulance", name: "Ambulance", category: "Support services", emergencyRelevant: true },
  { key: "dialysis", name: "Dialysis", category: "Specialty care", emergencyRelevant: true },
  { key: "ct_scan", name: "CT Scan", category: "Diagnostics", emergencyRelevant: true },
  { key: "mri", name: "MRI", category: "Diagnostics", emergencyRelevant: false },
  { key: "x_ray", name: "X-Ray", category: "Diagnostics", emergencyRelevant: true },
  { key: "ultrasound", name: "Ultrasound", category: "Diagnostics", emergencyRelevant: false },
  { key: "laboratory", name: "Laboratory", category: "Diagnostics", emergencyRelevant: false },
];

const SPECIALIZATIONS = [
  "cardiology", "cardiac_surgery", "neurology", "neurosurgery", "nephrology",
  "oncology", "radiotherapy", "gastroenterology", "orthopedics", "pediatrics",
  "obstetrics", "gynecology", "urology", "pulmonology",
].map((key) => ({
  key,
  name: key.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
}));

/* ---------------------------------- report ---------------------------------- */

interface Report {
  recordsRead: number;
  upserted: number;
  skipped: number;
  errors: string[];
  issues: { hospital: string; issue: ValidationIssue }[];
  duplicates: { a: string; b: string; reason: string }[];
  cmchisUpserted: number;
  crossSourceDuplicates: { existingName: string; incomingName: string; sharedWords: string[] }[];
}

async function main() {
  const prisma = createPrismaClient();
  const report: Report = {
    recordsRead: 0,
    upserted: 0,
    skipped: 0,
    errors: [],
    issues: [],
    duplicates: [],
    cmchisUpserted: 0,
    crossSourceDuplicates: [],
  };

  const run = await prisma.importRun.create({
    data: { datasetKey: "chennai-cmchis-second-source" },
  });

  try {
    await seedCatalogue(prisma);
    const sourceId = await upsertHospitalSource(prisma);
    await importHospitals(prisma, sourceId, report);
    await importSchemes(prisma);
    await importCmchisHospitals(prisma, report);
    await buildVerificationQueue(prisma, report);

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        finishedAt: new Date(),
        recordsRead: report.recordsRead,
        recordsUpserted: report.upserted,
        recordsSkipped: report.skipped,
        errors: report.errors.length,
        report: JSON.stringify({
          issues: report.issues.length,
          duplicates: report.duplicates.length,
        }),
      },
    });

    await printReport(prisma, report);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedCatalogue(prisma: PrismaClient) {
  for (const facility of FACILITIES) {
    await prisma.facility.upsert({
      where: { key: facility.key },
      update: facility,
      create: facility,
    });
  }
  for (const spec of SPECIALIZATIONS) {
    await prisma.specialization.upsert({
      where: { key: spec.key },
      update: spec,
      create: spec,
    });
  }
  console.log(
    `catalogue: ${FACILITIES.length} facilities, ${SPECIALIZATIONS.length} specializations`,
  );
}

async function upsertHospitalSource(prisma: PrismaClient): Promise<string> {
  const file = readJson("data/raw/chennai-district-hospitals.json");
  const key = file.source.key ?? file.source.id ?? "chennai-district-portal";

  const source = await prisma.dataSource.upsert({
    where: { key },
    update: { lastCheckedAt: COLLECTED_AT },
    create: {
      key,
      name: file.source.name,
      organization: file.source.organization,
      sourceType: "GOVERNMENT",
      url: file.source.url,
      reliability: "HIGH",
      authoritativeFor:
        "Hospital name, address, phone number and Government/Private classification for hospitals listed in the Chennai district public utilities directory.",
      notes: file.source.notes,
      lastCheckedAt: COLLECTED_AT,
    },
  });

  return source.id;
}

async function importHospitals(
  prisma: PrismaClient,
  sourceId: string,
  report: Report,
) {
  const file = readJson("data/raw/chennai-district-hospitals.json");
  const normalized: NormalizedHospital[] = [];

  for (const raw of file.records) {
    report.recordsRead++;

    const { record, issues } = normalizeHospital({
      name: String(raw.name ?? ""),
      address: (raw.address as string | null) ?? null,
      phone: (raw.phone as string | null) ?? null,
      type: (raw.type as string | null) ?? null,
    });

    if (!record.name) {
      report.skipped++;
      report.errors.push("Record with empty name skipped");
      continue;
    }

    normalized.push(record);
    issues.forEach((issue) => report.issues.push({ hospital: record.name, issue }));

    const hospital = await prisma.hospital.upsert({
      where: { slug: record.slug },
      update: {
        name: record.name,
        address: record.address,
        area: record.area,
        pincode: record.pincode,
        phone: record.phone,
        ownership: record.ownership,
        district: "Chennai",
        sourceId,
        // Name/address/phone are published by the district administration, so
        // they are VERIFIED against that source. Facilities and coordinates
        // are a different question and stay UNKNOWN below.
        verificationStatus: "VERIFIED",
        lastVerifiedAt: COLLECTED_AT,
        nextReviewAt: NEXT_REVIEW,
        verificationNotes:
          "Name, address, phone and ownership verified against the Chennai District public utilities directory. Facilities, coordinates and insurance networks are NOT verified.",
      },
      create: {
        slug: record.slug,
        name: record.name,
        address: record.address,
        area: record.area,
        pincode: record.pincode,
        phone: record.phone,
        ownership: record.ownership,
        district: "Chennai",
        sourceId,
        verificationStatus: "VERIFIED",
        lastVerifiedAt: COLLECTED_AT,
        nextReviewAt: NEXT_REVIEW,
        verificationNotes:
          "Name, address, phone and ownership verified against the Chennai District public utilities directory. Facilities, coordinates and insurance networks are NOT verified.",
      },
    });

    report.upserted++;

    // Field-level evidence for the values the source actually asserts.
    for (const [field, value] of [
      ["name", record.name],
      ["address", record.address],
      ["phone", record.phone],
      ["ownership", record.ownership],
    ] as const) {
      if (!value) continue;
      await prisma.dataEvidence.upsert({
        where: {
          entityType_entityId_field_sourceId: {
            entityType: "Hospital",
            entityId: hospital.id,
            field,
            sourceId,
          },
        },
        update: { value: String(value), checkedAt: COLLECTED_AT },
        create: {
          entityType: "Hospital",
          entityId: hospital.id,
          field,
          value: String(value),
          sourceUrl: file.source.url,
          checkedAt: COLLECTED_AT,
          sourceId,
        },
      });
    }
  }

  report.duplicates = findDuplicateCandidates(normalized);
  console.log(`hospitals: ${report.upserted} upserted, ${report.skipped} skipped`);
}

async function importSchemes(prisma: PrismaClient) {
  const file = readJson("data/verified/government-schemes.json");

  const source = await prisma.dataSource.upsert({
    where: { key: file.source.key! },
    update: { lastCheckedAt: COLLECTED_AT },
    create: {
      key: file.source.key!,
      name: file.source.name,
      organization: file.source.organization,
      sourceType: "GOVERNMENT",
      url: file.source.url,
      reliability: "HIGH",
      authoritativeFor: file.source.authoritativeFor,
      lastCheckedAt: COLLECTED_AT,
    },
  });

  for (const raw of file.records) {
    const data = raw as Record<string, string | null>;
    await prisma.governmentScheme.upsert({
      where: { key: data.key! },
      update: { lastVerifiedAt: COLLECTED_AT },
      create: {
        key: data.key!,
        schemeName: data.schemeName!,
        shortName: data.shortName,
        operator: data.operator,
        description: data.description,
        officialWebsite: data.officialWebsite,
        eligibility: data.eligibility,
        incomeCriteria: data.incomeCriteria,
        ageCriteria: data.ageCriteria,
        coverage: data.coverage,
        coveredTreatments: data.coveredTreatments,
        financialLimit: data.financialLimit,
        documentsRequired: data.documentsRequired,
        applicationMethod: data.applicationMethod,
        verificationStatus: "SOURCE_PROVIDED",
        lastVerifiedAt: COLLECTED_AT,
        nextReviewAt: NEXT_REVIEW,
        sourceId: source.id,
      },
    });
  }

  console.log(`schemes: ${file.records.length} upserted`);
}

/**
 * Second source: CMCHIS empanelled hospitals.
 *
 * These are separate Hospital rows from the district-portal ones — CMCHIS
 * publishes only name and type, never address or phone, so a CMCHIS-sourced
 * row can never legitimately overwrite the richer district-portal fields.
 * Slugs are namespaced ("cmchis-...") specifically so an upsert here can never
 * collide with, and therefore can never silently overwrite, an existing
 * district-portal row — see docs at the top of normalizeCmchisHospital.
 *
 * What this DOES establish with real confidence: that the hospital appears on
 * the state government's own empanelment list, recorded as a HospitalScheme
 * row with status VERIFIED_EMPANELLED. What it does NOT establish: address,
 * phone, coordinates, or (for ~50 of the 62) ownership — those stay null/
 * UNKNOWN and land in the verification queue like everything else unverified.
 */
async function importCmchisHospitals(prisma: PrismaClient, report: Report) {
  const file = readJson("data/raw/cmchis-empanelled-hospitals.json");
  const key = file.source.key!;

  const source = await prisma.dataSource.upsert({
    where: { key },
    update: { lastCheckedAt: COLLECTED_AT },
    create: {
      key,
      name: file.source.name,
      organization: file.source.organization,
      sourceType: "GOVERNMENT",
      url: file.source.url,
      reliability: "HIGH",
      authoritativeFor: file.source.authoritativeFor,
      notes: file.source.notes,
      lastCheckedAt: COLLECTED_AT,
    },
  });

  const cmchisScheme = await prisma.governmentScheme.findUnique({
    where: { key: "cmchis" },
  });
  if (!cmchisScheme) {
    throw new Error("CMCHIS GovernmentScheme row not found — importSchemes must run first");
  }

  // Existing hospitals, for cross-source duplicate-candidate detection only.
  // This never merges anything; it only produces VerificationTask rows for a
  // human to look at.
  const existingHospitals = await prisma.hospital.findMany({
    where: { sourceId: { not: source.id } },
    select: { name: true },
  });

  const incoming = (file.records as { namePublished: string; type: string }[]).map(
    (raw) => normalizeCmchisHospital(raw),
  );

  report.crossSourceDuplicates = findCrossSourceDuplicates(existingHospitals, incoming);

  for (const record of incoming) {
    const hospital = await prisma.hospital.upsert({
      where: { slug: record.slug },
      update: {
        // Deliberately narrow: only what CMCHIS actually asserts. Address,
        // phone, area and pincode are never touched here, so if a future run
        // of this same importer somehow matched an existing richer row (it
        // cannot, by construction of the namespaced slug), those fields would
        // still never be at risk from this branch.
        name: record.name,
        ownership: record.ownership,
        district: "Chennai",
        verificationStatus: "SOURCE_PROVIDED",
        lastVerifiedAt: COLLECTED_AT,
        nextReviewAt: NEXT_REVIEW,
        verificationNotes:
          "Name and empanelment verified against the CMCHIS empanelled hospital list. CMCHIS does not publish address, phone or coordinates for this record.",
      },
      create: {
        slug: record.slug,
        name: record.name,
        ownership: record.ownership,
        district: "Chennai",
        sourceId: source.id,
        verificationStatus: "SOURCE_PROVIDED",
        lastVerifiedAt: COLLECTED_AT,
        nextReviewAt: NEXT_REVIEW,
        verificationNotes:
          "Name and empanelment verified against the CMCHIS empanelled hospital list. CMCHIS does not publish address, phone or coordinates for this record.",
      },
    });

    report.cmchisUpserted++;

    // Field-level evidence, scoped to exactly what CMCHIS asserts.
    await prisma.dataEvidence.upsert({
      where: {
        entityType_entityId_field_sourceId: {
          entityType: "Hospital",
          entityId: hospital.id,
          field: "name",
          sourceId: source.id,
        },
      },
      update: { value: record.name, checkedAt: COLLECTED_AT },
      create: {
        entityType: "Hospital",
        entityId: hospital.id,
        field: "name",
        value: record.namePublished,
        sourceUrl: file.source.url,
        checkedAt: COLLECTED_AT,
        sourceId: source.id,
        notes: "Verbatim as published, before boilerplate suffix cleanup.",
      },
    });

    if (record.ownership === "GOVERNMENT") {
      await prisma.dataEvidence.upsert({
        where: {
          entityType_entityId_field_sourceId: {
            entityType: "Hospital",
            entityId: hospital.id,
            field: "ownership",
            sourceId: source.id,
          },
        },
        update: { value: "GOVERNMENT", checkedAt: COLLECTED_AT },
        create: {
          entityType: "Hospital",
          entityId: hospital.id,
          field: "ownership",
          value: "GOVERNMENT",
          sourceUrl: file.source.url,
          checkedAt: COLLECTED_AT,
          sourceId: source.id,
          notes:
            "Inferred from the published name beginning with 'Govt' — CMCHIS did not provide a separate ownership field for this record.",
        },
      });
    }

    // The empanelment relationship itself: this is what CMCHIS's own list
    // directly establishes, with high confidence.
    await prisma.hospitalScheme.upsert({
      where: { hospitalId_schemeId: { hospitalId: hospital.id, schemeId: cmchisScheme.id } },
      update: {
        status: "VERIFIED_EMPANELLED",
        verificationStatus: "VERIFIED",
        lastVerifiedAt: COLLECTED_AT,
        sourceId: source.id,
      },
      create: {
        hospitalId: hospital.id,
        schemeId: cmchisScheme.id,
        status: "VERIFIED_EMPANELLED",
        verificationStatus: "VERIFIED",
        lastVerifiedAt: COLLECTED_AT,
        sourceId: source.id,
        notes: "Hospital appears on CMCHIS's own published empanelment list.",
      },
    });
  }

  console.log(
    `cmchis: ${report.cmchisUpserted} hospitals upserted, ${report.crossSourceDuplicates.length} cross-source duplicate candidates flagged`,
  );
}

/**
 * Builds the manual follow-up queue.
 *
 * Every gap becomes a row someone can work through — by phoning the hospital,
 * or by finding an official source. Nothing here is guessed at to make the
 * database look finished.
 */
async function buildVerificationQueue(prisma: PrismaClient, report: Report) {
  await prisma.verificationTask.deleteMany({ where: { resolved: false } });

  const tasks: {
    entityType: string;
    entityId?: string;
    entityName: string;
    field: string;
    currentValue?: string;
    reason: "MISSING_REQUIRED_FIELD" | "UNVERIFIED_VALUE" | "POSSIBLE_DUPLICATE";
    detail: string;
    sourceKey?: string;
  }[] = [];

  // Field-level gaps found during normalisation.
  for (const { hospital, issue } of report.issues) {
    tasks.push({
      entityType: "Hospital",
      entityName: hospital,
      field: issue.field,
      currentValue: issue.value ?? undefined,
      reason: "MISSING_REQUIRED_FIELD",
      detail: issue.reason,
      sourceKey: "chennai-district-portal",
    });
  }

  // Duplicate candidates for a human to adjudicate.
  for (const pair of report.duplicates) {
    tasks.push({
      entityType: "Hospital",
      entityName: `${pair.a} / ${pair.b}`,
      field: "identity",
      reason: "POSSIBLE_DUPLICATE",
      detail: pair.reason,
    });
  }

  // Cross-source duplicate candidates: same institution named differently by
  // the district portal and by CMCHIS. Flagged, never auto-merged — see
  // findCrossSourceDuplicates for why.
  for (const pair of report.crossSourceDuplicates) {
    tasks.push({
      entityType: "Hospital",
      entityName: `${pair.existingName} / ${pair.incomingName}`,
      field: "identity",
      reason: "POSSIBLE_DUPLICATE",
      detail: `District-portal record "${pair.existingName}" and CMCHIS record "${pair.incomingName}" share the word(s) [${pair.sharedWords.join(", ")}] — may be the same hospital named differently by the two sources. Not merged automatically.`,
      sourceKey: "cmchis-empanelled-hospitals",
    });
  }

  // Every hospital needs coordinates and facility verification; neither is
  // published by the district directory.
  const hospitals = await prisma.hospital.findMany({
    select: { id: true, name: true, latitude: true, website: true },
  });

  for (const hospital of hospitals) {
    if (hospital.latitude === null) {
      tasks.push({
        entityType: "Hospital",
        entityId: hospital.id,
        entityName: hospital.name,
        field: "latitude/longitude",
        reason: "MISSING_REQUIRED_FIELD",
        detail:
          "Not geocoded. Requires a geocoding pass against an approved provider (e.g. Nominatim, respecting its usage policy). Coordinates must never be estimated by hand.",
      });
    }
    if (!hospital.website) {
      tasks.push({
        entityType: "Hospital",
        entityId: hospital.id,
        entityName: hospital.name,
        field: "website",
        reason: "MISSING_REQUIRED_FIELD",
        detail:
          "Official website not confirmed. Needed before facilities can be verified from the hospital's own pages.",
      });
    }
    tasks.push({
      entityType: "HospitalFacility",
      entityId: hospital.id,
      entityName: hospital.name,
      field: "facilities (all)",
      reason: "UNVERIFIED_VALUE",
      detail:
        "No facility inventory has been obtained from any official source, so every facility for this hospital is UNKNOWN. Verify from the hospital's official website or by telephone.",
    });
  }

  // Blood banks: the model exists but nothing has been imported.
  tasks.push({
    entityType: "BloodBank",
    entityName: "Chennai blood banks (all)",
    field: "entire dataset",
    reason: "MISSING_REQUIRED_FIELD",
    detail:
      "Not imported. The official directory at eraktkosh.mohfw.gov.in requires interactive state/district selection in a client-rendered UI, and its legacy JSP endpoints now 404. Needs either a manual export or a scripted browser session. Real-time stock must never be stored — query it live or not at all.",
    sourceKey: "eraktkosh",
  });

  for (const task of tasks) {
    await prisma.verificationTask.create({ data: task });
  }

  console.log(`verification queue: ${tasks.length} tasks`);
}

async function printReport(prisma: PrismaClient, report: Report) {
  const [
    hospitals,
    govt,
    priv,
    unknownOwn,
    bySourceRaw,
    facilities,
    hospitalFacilities,
    verifiedFacilities,
    insurances,
    bloodBanks,
    schemes,
    empanelments,
    evidence,
    tasks,
    noPhone,
    noCoords,
    noPincode,
  ] = await Promise.all([
    prisma.hospital.count(),
    prisma.hospital.count({ where: { ownership: "GOVERNMENT" } }),
    prisma.hospital.count({ where: { ownership: "PRIVATE" } }),
    prisma.hospital.count({ where: { ownership: "UNKNOWN" } }),
    prisma.dataSource.findMany({
      select: { key: true, name: true, _count: { select: { hospitals: true } } },
      orderBy: { key: "asc" },
    }),
    prisma.facility.count(),
    prisma.hospitalFacility.count(),
    prisma.hospitalFacility.count({ where: { status: "VERIFIED_AVAILABLE" } }),
    prisma.hospitalInsurance.count(),
    prisma.bloodBank.count(),
    prisma.governmentScheme.count(),
    prisma.hospitalScheme.count({ where: { status: "VERIFIED_EMPANELLED" } }),
    prisma.dataEvidence.count(),
    prisma.verificationTask.count({ where: { resolved: false } }),
    prisma.hospital.count({ where: { phone: null } }),
    prisma.hospital.count({ where: { latitude: null } }),
    prisma.hospital.count({ where: { pincode: null } }),
  ]);

  const line = "-".repeat(58);
  console.log(`\n${line}\nDATA QUALITY REPORT — Chennai, Tamil Nadu\n${line}`);
  console.log(`Total hospitals:              ${hospitals}`);
  console.log(`  Government:                 ${govt}`);
  console.log(`  Private:                    ${priv}`);
  console.log(`  Ownership unknown:          ${unknownOwn}`);
  console.log(`\nBy source:`);
  for (const s of bySourceRaw) {
    console.log(`  ${s.key.padEnd(28)} ${s._count.hospitals}`);
  }
  console.log(`\nFacility catalogue entries:   ${facilities}`);
  console.log(`Hospital-facility records:    ${hospitalFacilities}`);
  console.log(`  Verified available:         ${verifiedFacilities}`);
  console.log(`  Unknown (not asserted):     ${hospitals * facilities - hospitalFacilities} pairs carry no row, which reads as UNKNOWN`);
  console.log(`\nInsurance relationships:      ${insurances}`);
  console.log(`Blood banks:                  ${bloodBanks}`);
  console.log(`Government schemes:           ${schemes}`);
  console.log(`  Verified empanelments:      ${empanelments}`);
  console.log(`Field-level evidence rows:    ${evidence}`);
  console.log(`\nMissing phone numbers:        ${noPhone}`);
  console.log(`Missing coordinates:          ${noCoords}`);
  console.log(`Missing pincode:              ${noPincode}`);
  console.log(`Same-source duplicate candidates:   ${report.duplicates.length}`);
  console.log(`Cross-source duplicate candidates:  ${report.crossSourceDuplicates.length}`);
  console.log(`\nManual verification tasks:    ${tasks}`);
  console.log(line);
}

main().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
