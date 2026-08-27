import VerificationBadge from "@/app/components/VerificationBadge";
import type { Provenance } from "@/app/data/provenance";
import { getSource } from "@/app/data/sources";
import { formatIsoDate } from "@/app/lib/format";

/**
 * Shows where a record or a single field came from: its status, the named
 * source, a link to the exact page, and when it was last checked. Real and demo
 * records both flow through this, so nothing can be displayed without it.
 */
export default function ProvenanceNote({
  provenance,
  showBadge = true,
  className = "",
}: {
  provenance: Provenance;
  showBadge?: boolean;
  className?: string;
}) {
  const { status, sourceId, sourceUrl, lastVerified, note } = provenance;
  const source = sourceId ? getSource(sourceId) : null;
  const checked = lastVerified ? formatIsoDate(lastVerified) : null;

  return (
    <div className={`text-xs leading-relaxed text-slate-600 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {showBadge ? <VerificationBadge status={status} /> : null}

        {source ? (
          <span>
            Source:{" "}
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded font-medium underline underline-offset-2 hover:text-slate-900"
              >
                {source.name}
              </a>
            ) : (
              <span className="font-medium">{source.name}</span>
            )}
          </span>
        ) : (
          <span>No source</span>
        )}

        <span aria-hidden="true">·</span>
        <span>Last verified: {checked ?? "never"}</span>
      </div>

      {note ? <p className="mt-1.5 text-slate-500">{note}</p> : null}
    </div>
  );
}
