import {
  VERIFICATION_DOTS,
  VERIFICATION_LABELS,
  VERIFICATION_TONES,
  type VerificationStatus,
} from "@/app/data/provenance";

/**
 * The one place a verification status becomes a visible label. Every list row,
 * detail page and field-level note renders through this, so VERIFIED can never
 * appear on one screen while the same record reads NOT VERIFIED on another.
 *
 * The status dot carries the meaning at a glance; the text carries it for
 * anyone who cannot rely on colour.
 */
export default function VerificationBadge({
  status,
  className = "",
}: {
  status: VerificationStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] ${VERIFICATION_TONES[status]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${VERIFICATION_DOTS[status]}`}
      />
      {VERIFICATION_LABELS[status]}
    </span>
  );
}
