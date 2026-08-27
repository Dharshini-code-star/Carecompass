/**
 * Adapter between the datasets and the pure ranking logic in `escalation.ts`.
 *
 * Everything that knows about storage lives here. The ranker itself receives
 * plain resolved data, so replacing these arrays with a database means
 * rewriting this file only.
 */

import {
  FACILITIES,
  getFacility,
  isFacilityId,
  type FacilityId,
  type FacilityStatus,
} from "@/app/data/facilities";
import {
  DEMO_ORIGIN,
  DEMO_SCENARIO_HOSPITALS,
  DEMO_PROVENANCE_FOR_SCENARIO,
  demoFacilityStatus,
} from "@/app/data/demo/escalation-scenario";
import type { Provenance } from "@/app/data/provenance";
import {
  facilityStatusFor,
  verifiedFacilityCount,
} from "@/app/data/real/hospital-facilities";
import { REAL_HOSPITALS } from "@/app/data/real/hospitals";
import { INSURERS as DEMO_INSURERS } from "@/app/data/demo/insurers";
import { INSURERS } from "@/app/data/real/products";
import { RELATIONSHIPS, SCHEMES } from "@/app/data/real/relationships";
import {
  assessCurrentHospital,
  distanceKmBetween,
  rankCandidates,
  safetyNotice,
  type Candidate,
  type InsuranceCompatibility,
  type RankedCandidate,
  type Urgency,
} from "@/app/lib/escalation";

export type Dataset = "real" | "demo";

/** What the user says they are covered by. */
export type CoverageSelection =
  | { kind: "none" }
  | { kind: "scheme"; id: string }
  | { kind: "insurer"; id: string };

export function coverageOptions(
  dataset: Dataset,
): { value: string; label: string }[] {
  if (dataset === "demo") {
    return [
      { value: "none", label: "Not specified" },
      ...DEMO_INSURERS.map((insurer) => ({
        value: `insurer:${insurer.id}`,
        label: `${insurer.name} (demo)`,
      })),
    ];
  }

  return [
    { value: "none", label: "Not specified" },
    ...Object.values(SCHEMES).map((scheme) => ({
      value: `scheme:${scheme.id}`,
      label: `${scheme.shortName} (government scheme)`,
    })),
    ...Object.values(INSURERS).map((insurer) => ({
      value: `insurer:${insurer.id}`,
      label: insurer.name,
    })),
  ];
}

export function parseCoverage(
  raw: string | undefined,
  dataset: Dataset = "real",
): CoverageSelection {
  if (!raw || raw === "none") return { kind: "none" };
  const [kind, id] = raw.split(":");
  if (kind === "scheme" && dataset === "real" && id in SCHEMES) {
    return { kind: "scheme", id };
  }
  if (kind === "insurer") {
    const known =
      dataset === "demo"
        ? DEMO_INSURERS.some((insurer) => insurer.id === id)
        : id in INSURERS;
    if (known) return { kind: "insurer", id };
  }
  return { kind: "none" };
}

export function coverageValue(selection: CoverageSelection): string {
  return selection.kind === "none" ? "none" : `${selection.kind}:${selection.id}`;
}

export interface InsuranceAssessment {
  compatibility: InsuranceCompatibility;
  provenance: Provenance | null;
}

const NO_COVERAGE_SELECTED: Provenance = {
  status: "not-verified",
  sourceId: null,
  sourceUrl: null,
  lastVerified: null,
  note: "No insurer was selected, so compatibility was not assessed.",
};

const NO_NETWORK_DATA: Provenance = {
  status: "not-verified",
  sourceId: null,
  sourceUrl: null,
  lastVerified: null,
  note: "We hold no network list for this insurer. Network status is set per insurer and per policy and changes constantly — check with the insurer directly.",
};

/**
 * Resolves insurance compatibility for a real hospital.
 *
 * Government scheme empanelment is genuinely verifiable and comes from the
 * state government's own list. Private insurer networks are not: we hold no
 * such data, so those always resolve to `unknown` rather than being guessed
 * in either direction.
 */
export function assessInsuranceReal(
  hospitalId: string,
  coverage: CoverageSelection,
): InsuranceAssessment {
  if (coverage.kind === "none") {
    return { compatibility: "unknown", provenance: NO_COVERAGE_SELECTED };
  }

  if (coverage.kind === "insurer") {
    return { compatibility: "unknown", provenance: NO_NETWORK_DATA };
  }

  const match = RELATIONSHIPS.find(
    (relationship) =>
      relationship.hospitalId === hospitalId &&
      relationship.subject.kind === "scheme" &&
      relationship.subject.schemeId === coverage.id,
  );

  if (!match) {
    return {
      compatibility: "unknown",
      provenance: {
        status: "not-verified",
        sourceId: null,
        sourceUrl: null,
        lastVerified: null,
        note: "This hospital does not appear in the scheme list we hold. That is not the same as being excluded from the scheme.",
      },
    };
  }

  return { compatibility: "compatible", provenance: match.provenance };
}

export interface EscalationQuery {
  dataset: Dataset;
  facilityId: FacilityId;
  urgency: Urgency;
  coverage: CoverageSelection;
  currentHospitalId: string | null;
  maxRadiusKm: number | null;
}

export interface HospitalOption {
  id: string;
  label: string;
}

export interface EscalationResult {
  facilityName: string;
  currentHospital: { id: string; name: string } | null;
  currentStatus: FacilityStatus | null;
  assessment: ReturnType<typeof assessCurrentHospital> | null;
  alternatives: RankedCandidate[];
  safety: string;
  /** True when the dataset genuinely cannot answer the facility question. */
  dataGap: boolean;
}

function realCandidates(query: EscalationQuery): Candidate[] {
  return REAL_HOSPITALS.map((hospital) => {
    const facility = facilityStatusFor(hospital.id, query.facilityId);
    const insurance = assessInsuranceReal(hospital.id, query.coverage);

    return {
      hospitalId: hospital.id,
      name: hospital.name,
      area: hospital.area.value,
      facilityStatus: facility.status,
      facilityTrust: facility.provenance.status,
      insurance: insurance.compatibility,
      insuranceTrust: insurance.provenance?.status ?? "not-verified",
      // No coordinates are verified for any real hospital, so distance is
      // unknown rather than estimated.
      distanceKm: distanceKmBetween(null, hospital.coordinates.value),
      verifiedFacilityCount: verifiedFacilityCount(hospital.id),
      emergencyCapable: hospital.emergency.value,
      isCurrentHospital: hospital.id === query.currentHospitalId,
    };
  });
}

function demoCandidates(query: EscalationQuery): Candidate[] {
  const origin =
    DEMO_SCENARIO_HOSPITALS.find((h) => h.id === query.currentHospitalId)
      ?.coordinates ?? DEMO_ORIGIN;

  return DEMO_SCENARIO_HOSPITALS.map((hospital) => {
    const status = demoFacilityStatus(hospital, query.facilityId);

    const compatibility: InsuranceCompatibility =
      query.coverage.kind === "insurer"
        ? hospital.demoInsurerIds.includes(query.coverage.id)
          ? "compatible"
          : "unknown"
        : "unknown";

    return {
      hospitalId: hospital.id,
      name: hospital.name,
      area: hospital.area,
      facilityStatus: status,
      facilityTrust: DEMO_PROVENANCE_FOR_SCENARIO.status,
      insurance: compatibility,
      insuranceTrust: DEMO_PROVENANCE_FOR_SCENARIO.status,
      distanceKm: distanceKmBetween(origin, hospital.coordinates),
      verifiedFacilityCount: hospital.facilities.filter(
        (f) => f.status === "available",
      ).length,
      emergencyCapable: hospital.emergencyCapable,
      isCurrentHospital: hospital.id === query.currentHospitalId,
    };
  });
}

export function hospitalOptions(dataset: Dataset): HospitalOption[] {
  if (dataset === "demo") {
    return DEMO_SCENARIO_HOSPITALS.map((hospital) => ({
      id: hospital.id,
      label: `${hospital.name} (demo)`,
    }));
  }

  return REAL_HOSPITALS.map((hospital) => ({
    id: hospital.id,
    label: hospital.area.value
      ? `${hospital.name} — ${hospital.area.value}`
      : hospital.name,
  })).sort((a, b) => a.label.localeCompare(b.label, "en"));
}

export const FACILITY_OPTIONS = FACILITIES.map((facility) => ({
  value: facility.id,
  label: `${facility.name} — ${facility.category}`,
}));

export function parseEscalationQuery(
  params: Record<string, string | string[] | undefined>,
): EscalationQuery {
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const facilityRaw = first(params.facility) ?? "icu";
  const urgencyRaw = first(params.urgency);
  const datasetRaw = first(params.dataset);
  const radiusRaw = Number(first(params.radius));

  const dataset: Dataset = datasetRaw === "demo" ? "demo" : "real";
  const ids = new Set(hospitalOptions(dataset).map((option) => option.id));
  const currentRaw = first(params.current);

  return {
    dataset,
    facilityId: isFacilityId(facilityRaw) ? facilityRaw : "icu",
    urgency:
      urgencyRaw === "critical" || urgencyRaw === "normal"
        ? urgencyRaw
        : "high",
    coverage: parseCoverage(first(params.coverage), dataset),
    currentHospitalId:
      currentRaw && ids.has(currentRaw) ? currentRaw : null,
    maxRadiusKm:
      Number.isFinite(radiusRaw) && radiusRaw > 0 && radiusRaw <= 100
        ? radiusRaw
        : null,
  };
}

/** Runs the whole flow: assess where the user is, then rank alternatives. */
export async function runEscalation(
  query: EscalationQuery,
): Promise<EscalationResult> {
  const facility = getFacility(query.facilityId);
  const facilityName = facility?.name ?? query.facilityId;

  const candidates =
    query.dataset === "demo" ? demoCandidates(query) : realCandidates(query);

  const current =
    candidates.find((candidate) => candidate.isCurrentHospital) ?? null;

  const assessment = current
    ? assessCurrentHospital(current.facilityStatus, facilityName, current.name)
    : null;

  const alternatives = rankCandidates(
    candidates.filter((candidate) => !candidate.isCurrentHospital),
    {
      urgency: query.urgency,
      facilityName,
      maxRadiusKm: query.maxRadiusKm,
    },
  );

  return {
    facilityName,
    currentHospital: current
      ? { id: current.hospitalId, name: current.name }
      : null,
    currentStatus: current ? current.facilityStatus : null,
    assessment,
    alternatives,
    safety: safetyNotice(query.urgency),
    dataGap: alternatives.every(
      (alternative) => alternative.facilityStatus === "unknown",
    ),
  };
}
