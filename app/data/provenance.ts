/**
 * Verification state and source metadata for every displayed fact.
 * A missing value is always unknown, never a negative claim.
 */

export type VerificationStatus =
  | "verified"
  | "source-provided"
  | "not-verified"
  | "demo";

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  verified: "Verified",
  "source-provided": "Partially verified",
  "not-verified": "Unknown",
  demo: "Demo data",
};

export const VERIFICATION_MEANINGS: Record<VerificationStatus, string> = {
  verified: "Confirmed against an official source on the date shown.",
  "source-provided":
    "Taken from a named source but not independently confirmed with the hospital or insurer.",
  "not-verified": "Unknown - no verified source available.",
  demo: "Invented for this prototype. It does not describe anything real.",
};

export const VERIFICATION_TONES: Record<VerificationStatus, string> = {
  verified: "border-brand-200 bg-brand-50 text-brand-800",
  "source-provided": "border-cite-200 bg-cite-50 text-cite-700",
  "not-verified": "border-ink-300 bg-ink-100 text-ink-700",
  demo: "border-caution-200 bg-caution-50 text-caution-800",
};

export const VERIFICATION_DOTS: Record<VerificationStatus, string> = {
  verified: "bg-brand-500",
  "source-provided": "bg-cite-600",
  "not-verified": "bg-ink-400",
  demo: "bg-caution-300",
};

export interface Provenance {
  status: VerificationStatus;
  sourceId: SourceId | null;
  sourceUrl: string | null;
  lastVerified: string | null;
  note?: string;
}

export interface Fact<T> {
  value: T | null;
  provenance: Provenance;
}

export const UNKNOWN_PROVENANCE: Provenance = {
  status: "not-verified",
  sourceId: null,
  sourceUrl: null,
  lastVerified: null,
};

export function unknown<T>(note?: string): Fact<T> {
  return {
    value: null,
    provenance: note
      ? { ...UNKNOWN_PROVENANCE, note }
      : UNKNOWN_PROVENANCE,
  };
}

export const DEMO_PROVENANCE: Provenance = {
  status: "demo",
  sourceId: "demo",
  sourceUrl: null,
  lastVerified: null,
};

export function demoFact<T>(value: T): Fact<T> {
  return { value, provenance: DEMO_PROVENANCE };
}

export interface WithProvenance {
  provenance: Provenance;
}

import type { SourceId } from "@/app/data/sources";
