/**
 * Hospital facility escalation: the ranking logic, as a pure module.
 *
 * WHAT THIS IS
 * Navigation and information support. Given a facility someone says they need,
 * it orders hospitals by how well the available *data* matches that need, and
 * explains every placement.
 *
 * WHAT THIS IS NOT
 * A medical decision system. It never infers a condition, never says anyone
 * should move hospital, and never treats absence of data as absence of a
 * facility. The wording it produces is deliberately neutral for that reason.
 *
 * WHY IT IS PURE
 * No dataset imports and no React — only `import type`, which is erased at
 * runtime. That keeps the scoring reasonable about, lets the tests run under
 * `node --experimental-strip-types` with no test-runner dependency, and means
 * swapping the local arrays for a database changes the adapter, not this file.
 */

import type { FacilityStatus } from "@/app/data/facilities";
import type { VerificationStatus } from "@/app/data/provenance";

export type Urgency = "critical" | "high" | "normal";

export const URGENCY_LABELS: Record<Urgency, string> = {
  critical: "Critical",
  high: "High",
  normal: "Normal",
};

/**
 * How well a hospital matches an insurer. `unknown` is never rendered or
 * scored as `compatible` — that conflation is the failure mode this whole
 * product exists to avoid.
 */
export type InsuranceCompatibility = "compatible" | "not-compatible" | "unknown";

export const INSURANCE_LABELS: Record<InsuranceCompatibility, string> = {
  compatible: "Compatible",
  "not-compatible": "Not compatible",
  unknown: "Could not be verified",
};

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Everything the ranker needs about one hospital, already resolved. */
export interface Candidate {
  hospitalId: string;
  name: string;
  /** Locality, where known. Only used for display in reasons. */
  area: string | null;
  facilityStatus: FacilityStatus;
  /** How far the facility claim itself can be trusted. */
  facilityTrust: VerificationStatus;
  insurance: InsuranceCompatibility;
  insuranceTrust: VerificationStatus;
  /** Null means we do not know the distance, which is not the same as far. */
  distanceKm: number | null;
  /** How many of this hospital's facilities we have positively verified. */
  verifiedFacilityCount: number;
  /** Null means unknown, never "no emergency department". */
  emergencyCapable: boolean | null;
  isCurrentHospital: boolean;
}

export interface ScoreComponents {
  facility: number;
  insurance: number;
  distance: number;
  capability: number;
  trust: number;
}

export interface Reason {
  kind: "facility" | "insurance" | "distance" | "capability" | "trust";
  tone: "positive" | "neutral" | "caution";
  text: string;
}

export interface RankedCandidate extends Candidate {
  /** 1 = has the facility, 2 = unverified, 3 = recorded as not having it. */
  tier: 1 | 2 | 3;
  score: number;
  components: ScoreComponents;
  weighted: ScoreComponents;
  reasons: Reason[];
}

/**
 * Weights per urgency. They sum to 1 so the score is always 0..1 and
 * directly comparable between hospitals.
 *
 * Note how small `insurance` is under CRITICAL. That is deliberate: cost
 * considerations must not outrank capability when someone is in trouble.
 */
export const WEIGHTS: Record<Urgency, ScoreComponents> = {
  critical: {
    facility: 0.34,
    distance: 0.3,
    capability: 0.22,
    insurance: 0.06,
    trust: 0.08,
  },
  high: {
    facility: 0.32,
    distance: 0.22,
    capability: 0.16,
    insurance: 0.2,
    trust: 0.1,
  },
  normal: {
    facility: 0.28,
    distance: 0.16,
    capability: 0.14,
    insurance: 0.28,
    trust: 0.14,
  },
};

/** Distance at which the distance score halves, by urgency. */
const DISTANCE_HALF_LIFE_KM: Record<Urgency, number> = {
  critical: 5,
  high: 10,
  normal: 15,
};

const FACILITY_SCORE: Record<FacilityStatus, number> = {
  available: 1,
  unknown: 0.35,
  "not-available": 0,
};

const INSURANCE_SCORE: Record<InsuranceCompatibility, number> = {
  compatible: 1,
  unknown: 0.35,
  "not-compatible": 0,
};

const TRUST_SCORE: Record<VerificationStatus, number> = {
  verified: 1,
  "source-provided": 0.7,
  "not-verified": 0.35,
  demo: 0.2,
};

/**
 * Unknown distance scores below a hospital we know is close and above one we
 * know is far. It is explicitly not treated as zero, which would bury every
 * hospital whose coordinates we simply have not confirmed.
 */
const UNKNOWN_DISTANCE_SCORE = 0.45;

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance. Returns null if either point is missing. */
export function distanceKmBetween(
  a: GeoPoint | null,
  b: GeoPoint | null,
): number | null {
  if (!a || !b) return null;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function distanceScore(distanceKm: number | null, urgency: Urgency): number {
  if (distanceKm === null) return UNKNOWN_DISTANCE_SCORE;
  const half = DISTANCE_HALF_LIFE_KM[urgency];
  return 1 / (1 + Math.max(0, distanceKm) / half);
}

/**
 * A rough proxy for how equipped a hospital is, built only from what we have
 * positively verified. A hospital we know little about scores low here because
 * we know little — not because it is poorly equipped.
 */
function capabilityScore(candidate: Candidate): number {
  const emergency =
    candidate.emergencyCapable === true
      ? 0.55
      : candidate.emergencyCapable === false
        ? 0.1
        : 0.3;

  const breadth = Math.min(candidate.verifiedFacilityCount / 8, 1) * 0.45;
  return Math.min(1, emergency + breadth);
}

function trustScore(candidate: Candidate): number {
  return (
    TRUST_SCORE[candidate.facilityTrust] * 0.6 +
    TRUST_SCORE[candidate.insuranceTrust] * 0.4
  );
}

function tierFor(status: FacilityStatus): 1 | 2 | 3 {
  if (status === "available") return 1;
  if (status === "unknown") return 2;
  return 3;
}

function formatKm(km: number): string {
  return km < 10 ? km.toFixed(1) : Math.round(km).toString();
}

/**
 * Why this hospital appears where it does, in plain English.
 *
 * Every statement is hedged to what the data actually supports: "appears to
 * have" rather than "has", "could not be verified" rather than "does not".
 */
function buildReasons(
  candidate: Candidate,
  facilityName: string,
  urgency: Urgency,
): Reason[] {
  const reasons: Reason[] = [];

  if (candidate.facilityStatus === "available") {
    reasons.push({
      kind: "facility",
      tone: "positive",
      text: `Appears to have ${facilityName}, according to the source recorded against this hospital.`,
    });
  } else if (candidate.facilityStatus === "unknown") {
    reasons.push({
      kind: "facility",
      tone: "caution",
      text: `We could not verify whether ${facilityName} is available here. That is a gap in our data, not a sign the facility is missing.`,
    });
  } else {
    reasons.push({
      kind: "facility",
      tone: "caution",
      text: `Recorded as not offering ${facilityName}.`,
    });
  }

  if (candidate.insurance === "compatible") {
    reasons.push({
      kind: "insurance",
      tone: "positive",
      text: "Appears compatible with the insurance you selected.",
    });
  } else if (candidate.insurance === "unknown") {
    reasons.push({
      kind: "insurance",
      tone: "caution",
      text: "Insurance compatibility could not be verified. Confirm with your insurer before relying on it.",
    });
  } else {
    reasons.push({
      kind: "insurance",
      tone: "caution",
      text: "Recorded as not compatible with the insurance you selected.",
    });
  }

  if (candidate.distanceKm !== null) {
    reasons.push({
      kind: "distance",
      tone: "neutral",
      text: `Approximately ${formatKm(candidate.distanceKm)} km away${
        candidate.area ? ` in ${candidate.area}` : ""
      }.`,
    });
  } else {
    reasons.push({
      kind: "distance",
      tone: "caution",
      text: "Distance is unknown because we have not verified coordinates for this hospital.",
    });
  }

  if (candidate.emergencyCapable === true) {
    reasons.push({
      kind: "capability",
      tone: "positive",
      text:
        urgency === "critical"
          ? "Emergency care is confirmed here, which is weighted heavily at critical urgency."
          : "Emergency care is confirmed here.",
    });
  } else if (candidate.emergencyCapable === null) {
    reasons.push({
      kind: "capability",
      tone: "caution",
      text: "We have not confirmed whether this hospital has an emergency department.",
    });
  }

  if (candidate.facilityTrust === "demo" || candidate.insuranceTrust === "demo") {
    reasons.push({
      kind: "trust",
      tone: "caution",
      text: "This record is demo data and does not describe a real hospital.",
    });
  }

  return reasons;
}

export interface RankOptions {
  urgency: Urgency;
  /** Display name of the facility being searched for. */
  facilityName: string;
  /** Drop candidates beyond this distance. Unknown distances are never dropped. */
  maxRadiusKm?: number | null;
}

/**
 * Ranks candidates.
 *
 * Ordering is by tier first, then weighted score. Tiering is what guarantees a
 * hospital that appears to have the facility always outranks one that does
 * not, however close the second is or however good its insurance match —
 * which is the entire point of the feature.
 */
export function rankCandidates(
  candidates: Candidate[],
  options: RankOptions,
): RankedCandidate[] {
  const weights = WEIGHTS[options.urgency];
  const radius = options.maxRadiusKm ?? null;

  return candidates
    .filter((candidate) => {
      if (radius === null) return true;
      // A hospital whose distance we do not know is never silently dropped.
      if (candidate.distanceKm === null) return true;
      return candidate.distanceKm <= radius;
    })
    .map((candidate) => {
      const components: ScoreComponents = {
        facility: FACILITY_SCORE[candidate.facilityStatus],
        insurance: INSURANCE_SCORE[candidate.insurance],
        distance: distanceScore(candidate.distanceKm, options.urgency),
        capability: capabilityScore(candidate),
        trust: trustScore(candidate),
      };

      const weighted: ScoreComponents = {
        facility: components.facility * weights.facility,
        insurance: components.insurance * weights.insurance,
        distance: components.distance * weights.distance,
        capability: components.capability * weights.capability,
        trust: components.trust * weights.trust,
      };

      const score =
        weighted.facility +
        weighted.insurance +
        weighted.distance +
        weighted.capability +
        weighted.trust;

      return {
        ...candidate,
        tier: tierFor(candidate.facilityStatus),
        score,
        components,
        weighted,
        reasons: buildReasons(candidate, options.facilityName, options.urgency),
      };
    })
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name, "en");
    });
}

/* ------------------------- current-hospital check ------------------------- */

export type EscalationOutcome =
  /** The facility appears to be available where the user already is. */
  | "facility-available"
  /** Recorded as not available. Escalation is offered. */
  | "facility-not-available"
  /** Not enough information. Escalation is offered but nothing is concluded. */
  | "facility-unknown";

export interface CurrentHospitalAssessment {
  outcome: EscalationOutcome;
  headline: string;
  detail: string;
  /** Whether to offer the "find nearby hospitals" step. */
  offerEscalation: boolean;
}

/**
 * Assesses the hospital the user is already at.
 *
 * `unknown` deliberately does not become "not available". It offers the search
 * as an option and says plainly that the question is unresolved.
 */
export function assessCurrentHospital(
  status: FacilityStatus,
  facilityName: string,
  hospitalName: string,
): CurrentHospitalAssessment {
  if (status === "available") {
    return {
      outcome: "facility-available",
      headline: `${facilityName} appears to be available at ${hospitalName}.`,
      detail:
        "Based on the source recorded against this hospital. Confirm with the hospital before relying on it — facilities change, and availability on the day depends on capacity.",
      offerEscalation: false,
    };
  }

  if (status === "not-available") {
    return {
      outcome: "facility-not-available",
      headline: `${facilityName} is recorded as not available at ${hospitalName}.`,
      detail:
        "You can look at nearby hospitals where this facility appears to be available. Any move between hospitals is a decision for your treating medical team.",
      offerEscalation: true,
    };
  }

  return {
    outcome: "facility-unknown",
    headline: `We could not verify whether ${facilityName} is available at ${hospitalName}.`,
    detail:
      "This means our data is incomplete — it does not mean the facility is missing. Ask the hospital directly. You can also look at other hospitals if you want to compare.",
    offerEscalation: true,
  };
}

/**
 * The standing safety line for this feature. Shown wherever alternatives are
 * displayed, and worded so it can never read as an instruction to move.
 */
export function safetyNotice(urgency: Urgency): string {
  if (urgency === "critical") {
    return "If this is an emergency, follow the advice of the treating medical team and contact emergency medical services. This list is information only and is not medical advice.";
  }

  return "This is information support, not medical advice. Consider discussing any transfer options with your treating medical team before acting on this list.";
}
