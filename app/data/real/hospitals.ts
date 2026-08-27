/**
 * REAL Chennai hospitals.
 *
 * Every record here comes from the CMCHIS empanelled hospital list published by
 * the Government of Tamil Nadu, filtered to the Chennai district and to
 * hospitals the list classifies as multi-speciality. Collected 2026-08-27.
 *
 * What that source establishes: that the hospital exists, that it is in
 * Chennai, whether it is government or private, and that it is empanelled under
 * CMCHIS. That is all. It says nothing about street addresses, emergency
 * departments, or any private insurer's network — those fields stay unknown
 * unless a separate official source was checked, which is recorded per field.
 *
 * Hospital-to-insurer relationships are deliberately NOT in this file. See
 * `app/data/real/relationships.ts`.
 */

import {
  unknown,
  type Fact,
  type Provenance,
} from "@/app/data/provenance";
import type { GeoPoint } from "@/app/lib/escalation";

export const CHENNAI = "Chennai";
export const TAMIL_NADU = "Tamil Nadu";

/** The date the CMCHIS list was read for this dataset. */
export const CMCHIS_COLLECTED_ON = "2026-08-27";

export type Ownership = "government" | "private";

/** The classification CMCHIS itself applies. We do not invent categories. */
export type HospitalCategory = "Multi-speciality";

export interface Hospital {
  id: string;
  /** Tidied for display: spacing and capitalisation only, never new words. */
  name: string;
  /** Verbatim, exactly as the source publishes it. Shown on the detail page. */
  nameAsPublished: string;
  /** Locality, only where the published name states one. */
  area: Fact<string>;
  address: Fact<string>;
  city: string;
  state: string;
  category: HospitalCategory;
  ownership: Ownership;
  /** `null` means unknown, never "no emergency department". */
  emergency: Fact<boolean>;
  /**
   * Latitude/longitude. Unknown for every record: the CMCHIS list does not
   * publish coordinates and we have not confirmed them elsewhere, so distance
   * is reported as unknown rather than estimated.
   */
  coordinates: Fact<GeoPoint>;
  officialWebsite: Fact<string>;
  provenance: Provenance;
}

const CMCHIS: Provenance = {
  status: "verified",
  sourceId: "cmchis-empanelled-hospitals",
  sourceUrl: "https://www.cmchistn.com/empanelment/hospital-list",
  lastVerified: CMCHIS_COLLECTED_ON,
  note: "Read from the Chennai district filter of the Government of Tamil Nadu's CMCHIS empanelled hospital list.",
};

/** An area read out of the hospital's own published name. */
function areaFromName(area: string): Fact<string> {
  return {
    value: area,
    provenance: {
      ...CMCHIS,
      status: "source-provided",
      note: "Taken from the locality stated inside the hospital name as published by CMCHIS. Not a confirmed street address.",
    },
  };
}

function official(
  sourceId: "kauvery-official" | "mgm-healthcare-official",
  url: string,
): Provenance {
  return {
    status: "verified",
    sourceId,
    sourceUrl: url,
    lastVerified: "2026-08-27",
    note: "Stated by the hospital on its own website.",
  };
}

const NO_ADDRESS = unknown<string>(
  "The CMCHIS list does not publish street addresses, and we have not confirmed one from another official source.",
);

const NO_EMERGENCY = unknown<boolean>(
  "We have not confirmed emergency cover for this hospital from an official source. Unknown does not mean there is none — call the hospital.",
);

const NO_WEBSITE = unknown<string>(
  "We have not confirmed an official website for this hospital.",
);

interface Seed {
  id: string;
  name: string;
  nameAsPublished: string;
  area?: string;
  ownership: Ownership;
  emergency?: Fact<boolean>;
  officialWebsite?: Fact<string>;
}

function build(seed: Seed): Hospital {
  return {
    id: seed.id,
    name: seed.name,
    nameAsPublished: seed.nameAsPublished,
    area: seed.area ? areaFromName(seed.area) : unknown<string>(),
    address: NO_ADDRESS,
    city: CHENNAI,
    state: TAMIL_NADU,
    category: "Multi-speciality",
    ownership: seed.ownership,
    emergency: seed.emergency ?? NO_EMERGENCY,
    coordinates: unknown<GeoPoint>(
      "We have not verified coordinates for this hospital, so distances to it cannot be calculated.",
    ),
    officialWebsite: seed.officialWebsite ?? NO_WEBSITE,
    provenance: CMCHIS,
  };
}

const SEEDS: Seed[] = [
  // ---------------------------- government ----------------------------
  {
    id: "govt-stanley-medical-college-hospital",
    name: "Govt. Stanley Medical College Hospital",
    nameAsPublished: "Govt. Stanley Medical College Hospital,Chennai TN.",
    ownership: "government",
  },
  {
    id: "govt-kilpauk-medical-college-hospital",
    name: "Govt. Kilpauk Medical College Hospital",
    nameAsPublished: "Govt.Kilpauk Medical CollegeHospitalChennai,TN.",
    area: "Kilpauk",
    ownership: "government",
  },
  {
    id: "madras-medical-college",
    name: "Madras Medical College",
    nameAsPublished: "Madras Medical College,Chennai TN.",
    ownership: "government",
  },
  {
    id: "govt-royapettah-hospital",
    name: "Govt. Royapettah Hospital",
    nameAsPublished: "Govt. Royapettah Hospital, Royapetta,Chennai TN.",
    area: "Royapettah",
    ownership: "government",
  },
  {
    id: "govt-omandhurar-medical-college-hospital",
    name: "Govt. Omandhurar Medical College and Hospital",
    nameAsPublished: "Govt. Omandhurar Medical coll and hosp,Chennai TN.",
    ownership: "government",
  },
  {
    id: "govt-super-speciality-hospital-omandurar",
    name: "Govt. Super Speciality Hospital, Omandurar",
    nameAsPublished: "Govt.Super Speciality Hospital,Omandur Chennai TN.",
    area: "Omandurar",
    ownership: "government",
  },
  {
    id: "govt-periyar-nagar-hospital",
    name: "Govt. Periyar Nagar Hospital",
    nameAsPublished: "Govt. Periyar Nagar Hospital, Chennai TN.",
    area: "Periyar Nagar",
    ownership: "government",
  },
  {
    id: "institute-of-child-health-egmore",
    name: "ICH, Egmore",
    nameAsPublished: "ICH,Egmore,Chennai TN.",
    area: "Egmore",
    ownership: "government",
  },
  {
    id: "institute-of-obstetrics-and-gynaecology-egmore",
    name: "IOG, Egmore",
    nameAsPublished: "IOG,Egmore,Chennai TN.",
    area: "Egmore",
    ownership: "government",
  },
  {
    id: "govt-thiruvottiyur-uchc",
    name: "Govt. Thiruvottiyur UCHC",
    nameAsPublished: "Govt Thiruvottiyur UCHC, Chennai TN.",
    area: "Thiruvottiyur",
    ownership: "government",
  },
  {
    id: "govt-vadapalani-uchc",
    name: "Govt. Vadapalani UCHC",
    nameAsPublished: "Govt VADAPALANI UCHC, Chennai TN.",
    area: "Vadapalani",
    ownership: "government",
  },
  {
    id: "govt-puzhal-chc",
    name: "Govt. Puzhal CHC",
    nameAsPublished: "Govt Puzhal CHC, Chennai TN.",
    area: "Puzhal",
    ownership: "government",
  },

  // ------------------------------ private ------------------------------
  {
    id: "kauvery-hospital-chennai",
    name: "Kauvery Hospital, Chennai",
    nameAsPublished: "Kauvery Hospital Chennai,TN.",
    ownership: "private",
    officialWebsite: {
      value: "https://www.kauveryhospital.com/our-locations/chennai/",
      provenance: official(
        "kauvery-official",
        "https://www.kauveryhospital.com/our-locations/chennai/",
      ),
    },
  },
  {
    id: "kauvery-hospital-vadapalani",
    name: "Kauvery Hospital, Vadapalani",
    nameAsPublished: "Kauvery Hospital, Vadapalani, Chennai, TN.",
    area: "Vadapalani",
    ownership: "private",
    emergency: {
      value: true,
      provenance: official(
        "kauvery-official",
        "https://www.kauveryhospital.com/our-locations/chennai-vadapalani/",
      ),
    },
    officialWebsite: {
      value: "https://www.kauveryhospital.com/our-locations/chennai-vadapalani/",
      provenance: official(
        "kauvery-official",
        "https://www.kauveryhospital.com/our-locations/chennai-vadapalani/",
      ),
    },
  },
  {
    id: "mgm-healthcare-malar-adyar",
    name: "MGM Healthcare Malar, Adyar",
    nameAsPublished: "Mgm Healthcare Malar Adyar, Chennai, TN.",
    area: "Adyar",
    ownership: "private",
    // Deliberately no emergency and no address: MGM Healthcare's published
    // emergency department and address belong to its Nelson Manickam Road unit,
    // which is a different facility from the Malar unit in the CMCHIS list.
    officialWebsite: {
      value: "https://mgmhealthcare.in/",
      provenance: {
        ...official("mgm-healthcare-official", "https://mgmhealthcare.in/"),
        status: "source-provided",
        note: "The group's official website. We have not confirmed a page specific to the Malar (Adyar) unit named in the CMCHIS list.",
      },
    },
  },
  {
    id: "sims-vadapalani",
    name: "SIMS Hospital, Vadapalani",
    nameAsPublished: "SIMS, Vadapalani, Chennai TN.",
    area: "Vadapalani",
    ownership: "private",
  },
  {
    id: "vijaya-hospital",
    name: "Vijaya Hospital",
    nameAsPublished: "Vijaya Hospital,Chennai TN.",
    ownership: "private",
  },
  {
    id: "voluntary-health-services-tharamani",
    name: "Voluntary Health Services, Tharamani",
    nameAsPublished: "VOLUNTARY HEALTH SERVICES THARAMANI CHENNAI TN.",
    area: "Tharamani",
    ownership: "private",
  },
  {
    id: "kanchi-kamakoti-child-trust-hospital",
    name: "Kanchi Kamakoti Child Trust Hospital",
    nameAsPublished: "Kanchi Kamakoti Child Trust Hospital ,Chennai TN.",
    ownership: "private",
  },
  {
    id: "prashanth-hospital-velachery",
    name: "Prashanth Hospital, Velachery",
    nameAsPublished: "Prashanth Hospital Velachery Chennai TN.",
    area: "Velachery",
    ownership: "private",
  },
  {
    id: "medway-hospital",
    name: "Medway Hospital",
    nameAsPublished: "Medway Hospital, Chennai TN.",
    ownership: "private",
  },
  {
    id: "lifeline-multispeciality-hospital",
    name: "Lifeline Multispeciality Hospital",
    nameAsPublished: "Lifeline Multispeciality Hospital, Chennai TN.",
    ownership: "private",
  },
  {
    id: "meridian-hospital-madhavaram",
    name: "Meridian Hospital, Madhavaram",
    nameAsPublished: "Meridian Hospital, Madhavaram, Chennai, TN.",
    area: "Madhavaram",
    ownership: "private",
  },
  {
    id: "hycare-super-speciality-hospital",
    name: "Hycare Super Speciality Hospital",
    nameAsPublished: "Hycare Super Speciality Hospital, Chennai TN.",
    ownership: "private",
  },
  {
    id: "narayanaa-hospital-purasaiwakkam",
    name: "Narayanaa Hospital, Purasaiwakkam",
    nameAsPublished: "Narayanaa Hospital, Purasaiwakkam, Chennai, TN.",
    area: "Purasaiwakkam",
    ownership: "private",
  },
];

export const REAL_HOSPITALS: Hospital[] = SEEDS.map(build);
