/**
 * Hospital-to-insurance relationships. Deliberately a separate file.
 *
 * The rule this file exists to enforce: a product being listed by IRDAI says
 * NOTHING about whether any particular hospital accepts it. Those are two
 * unrelated facts and they are stored separately so that one can never be
 * silently inferred from the other.
 *
 * A relationship only appears here when an official source establishes it.
 * Today that means exactly one kind: empanelment under Tamil Nadu's CMCHIS
 * scheme, published by the state government.
 *
 * There are no private insurer network relationships in this file, and that is
 * not an oversight. Network lists are per-insurer, per-policy and change
 * constantly; no third party can mirror them accurately, and being wrong about
 * one at an admission desk causes real financial harm. The app reports
 * "Not verified" for every insurer against every hospital, and points people at
 * the insurer's own network lookup instead.
 */

import type { Provenance } from "@/app/data/provenance";
import { CMCHIS_COLLECTED_ON, REAL_HOSPITALS } from "@/app/data/real/hospitals";

export type SchemeId = "cmchis";

export interface Scheme {
  id: SchemeId;
  name: string;
  shortName: string;
  operator: string;
  description: string;
  officialUrl: string;
}

export const SCHEMES: Record<SchemeId, Scheme> = {
  cmchis: {
    id: "cmchis",
    name: "Chief Minister's Comprehensive Health Insurance Scheme",
    shortName: "CMCHIS",
    operator: "Government of Tamil Nadu",
    description:
      "Tamil Nadu's state health insurance scheme. Eligibility, the treatments covered and the amounts payable are set by the scheme, not by CareCompass.",
    officialUrl: "https://www.cmchistn.com/",
  },
};

/**
 * What the source actually establishes. None of these mean "your treatment
 * will be cashless" or "your claim will be approved".
 */
export type RelationshipClaim =
  /** The scheme's own published list names this hospital. */
  | "empanelled-in-scheme"
  /** An insurer publishes this hospital in a network list we have read. */
  | "listed-in-insurer-network";

export interface InsuranceRelationship {
  id: string;
  hospitalId: string;
  /** A relationship is with a government scheme or an insurer, never both. */
  subject:
    | { kind: "scheme"; schemeId: SchemeId }
    | { kind: "insurer"; insurerId: string };
  claim: RelationshipClaim;
  provenance: Provenance;
}

const CMCHIS_EMPANELMENT: Provenance = {
  status: "verified",
  sourceId: "cmchis-empanelled-hospitals",
  sourceUrl: "https://www.cmchistn.com/empanelment/hospital-list",
  lastVerified: CMCHIS_COLLECTED_ON,
  note: "This hospital appears on the Government of Tamil Nadu's published CMCHIS empanelled hospital list for the Chennai district. Empanelment is not the same as your treatment being covered — eligibility and covered procedures are set by the scheme.",
};

/**
 * Every hospital in the real dataset was taken from the CMCHIS list, so every
 * one of them carries this relationship. Generating it from that dataset keeps
 * the two from drifting apart.
 */
export const RELATIONSHIPS: InsuranceRelationship[] = REAL_HOSPITALS.map(
  (hospital) => ({
    id: `${hospital.id}--cmchis`,
    hospitalId: hospital.id,
    subject: { kind: "scheme", schemeId: "cmchis" },
    claim: "empanelled-in-scheme",
    provenance: CMCHIS_EMPANELMENT,
  }),
);

export function relationshipsForHospital(
  hospitalId: string,
): InsuranceRelationship[] {
  return RELATIONSHIPS.filter(
    (relationship) => relationship.hospitalId === hospitalId,
  );
}
