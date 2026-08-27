import {
  VERIFICATION_LABELS,
  VERIFICATION_TONES,
  type VerificationStatus,
} from "@/app/data/provenance";

/**
 * The one place a verification status becomes a visible label. Every list row,
 * detail page and field-level note renders through this, so VERIFIED can never
 * appear on one screen while the same record reads NOT VERIFIED on another.
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
      className={`inline-block rounded border px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${VERIFICATION_TONES[status]} ${className}`}
    >
      {VERIFICATION_LABELS[status]}
    </span>
  );
}
