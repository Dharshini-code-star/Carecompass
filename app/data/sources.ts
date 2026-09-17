/**
 * The registry of sources CareCompass is allowed to cite.
 *
 * Records reference a source by id and add their own deep link. Nothing stores
 * a source name or publisher inline, so a source can be corrected in one place.
 *
 * Adding an entry here is a deliberate act: it is a claim that the source is
 * authoritative for the kind of fact it is used for.
 */

export type SourceKind =
  /** The insurance regulator. */
  | "regulator"
  /** A central or state government body or scheme. */
  | "government"
  /** The organisation's own website, about itself. */
  | "official-site"
  /** Invented for the prototype. */
  | "demo";

export interface Source {
  id: SourceId;
  /** Shown to the reader, so it must name the source in plain English. */
  name: string;
  publisher: string;
  kind: SourceKind;
  /** Landing page for the source as a whole. */
  url: string | null;
  /** What this source can legitimately be cited for. */
  authoritativeFor: string;
}

export type SourceId =
  | "irdai-health-products"
  | "cmchis-empanelled-hospitals"
  | "kauvery-official"
  | "mgm-healthcare-official"
  | "demo";

export const SOURCES: Record<SourceId, Source> = {
  "irdai-health-products": {
    id: "irdai-health-products",
    name: "IRDAI Health Insurance Products database",
    publisher: "Insurance Regulatory and Development Authority of India",
    kind: "regulator",
    url: "https://irdai.gov.in/health-insurance-products",
    authoritativeFor:
      "Which health insurance products exist, their UIN, the insurer that filed them, and the date IRDAI approved them.",
  },
  "cmchis-empanelled-hospitals": {
    id: "cmchis-empanelled-hospitals",
    name: "CMCHIS empanelled hospital list",
    publisher:
      "Chief Minister's Comprehensive Health Insurance Scheme, Government of Tamil Nadu",
    kind: "government",
    url: "https://www.cmchistn.com/empanelment/hospital-list",
    authoritativeFor:
      "Which hospitals are empanelled under Tamil Nadu's CMCHIS scheme, and whether they are government or private.",
  },
  "kauvery-official": {
    id: "kauvery-official",
    name: "Kauvery Hospital official website",
    publisher: "Kauvery Hospital",
    kind: "official-site",
    url: "https://www.kauveryhospital.com/",
    authoritativeFor:
      "What Kauvery Hospital states about its own units and services.",
  },
  "mgm-healthcare-official": {
    id: "mgm-healthcare-official",
    name: "MGM Healthcare official website",
    publisher: "MGM Healthcare",
    kind: "official-site",
    url: "https://mgmhealthcare.in/",
    authoritativeFor:
      "What MGM Healthcare states about its own units and services.",
  },
  demo: {
    id: "demo",
    name: "Invented for this prototype",
    publisher: "CareCompass",
    kind: "demo",
    url: null,
    authoritativeFor: "Nothing. Demo records describe no real organisation.",
  },
};

export function getSource(id: SourceId): Source {
  return SOURCES[id];
}

/** Sources actually cited by real records, for the transparency page. */
export const CITED_SOURCE_IDS: SourceId[] = [
  "irdai-health-products",
  "cmchis-empanelled-hospitals",
  "kauvery-official",
  "mgm-healthcare-official",
];
