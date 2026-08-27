/**
 * How far a piece of information can be trusted, and where it came from.
 *
 * This is the backbone of the whole app. Nothing is displayed without it, and
 * nothing is described as verified unless a real source says so.
 */

export type VerificationStatus =
  /** Confirmed against an official primary source (the regulator, a government
   *  scheme list, or the organisation's own website). */
  | "verified"
  /** Comes from a named source we have linked, but we have not independently
   *  confirmed it with the hospital or insurer. */
  | "source-provided"
  /** Nobody has checked this. Also used for a fact we simply do not know. */
  | "not-verified"
  /** Invented for the prototype. Never describes anything real. */
  | "demo";

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  verified: "Verified",
  "source-provided": "Source provided",
  "not-verified": "Not verified",
  demo: "Demo data",
};

export const VERIFICATION_MEANINGS: Record<VerificationStatus, string> = {
  verified:
    "Checked against an official source — the regulator, a government scheme list, or the organisation's own website — on the date shown.",
  "source-provided":
    "Taken from the named source below, which is linked so you can read it yourself. We have not confirmed it separately with the hospital or insurer.",
  "not-verified":
    "We do not know this. It has not been checked, and we would rather say so than guess.",
  demo: "Invented for this prototype. It does not describe anything real.",
};

/**
 * Tailwind classes per status. Kept here so a badge, a list row and a detail
 * page can never drift apart in how they colour the same status.
 */
export const VERIFICATION_TONES: Record<VerificationStatus, string> = {
  verified: "bg-teal-50 text-teal-900 border-teal-200",
  "source-provided": "bg-sky-50 text-sky-900 border-sky-200",
  "not-verified": "bg-slate-100 text-slate-700 border-slate-300",
  demo: "bg-amber-50 text-amber-900 border-amber-300",
};

export interface Provenance {
  status: VerificationStatus;
  /** Key into the source registry in `app/data/sources.ts`. */
  sourceId: SourceId | null;
  /** Deep link to the exact page or document this came from, when there is one. */
  sourceUrl: string | null;
  /** ISO date (YYYY-MM-DD) this was last checked. Null means never. */
  lastVerified: string | null;
  /** Anything the reader needs in order not to over-read the record. */
  note?: string;
}

/**
 * A single fact that may or may not be established, carrying its own
 * provenance. Used where one field of a record is verified and the rest are
 * not — for example a hospital whose website we confirmed but whose emergency
 * cover we did not.
 *
 * `value: null` always means "we do not know", never "no".
 */
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

/** The value of a fact nobody has established. */
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

// Imported last to keep the type-only cycle obvious and harmless.
import type { SourceId } from "@/app/data/sources";
