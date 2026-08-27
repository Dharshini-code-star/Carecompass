import VerificationBadge from "@/app/components/VerificationBadge";
import type { Provenance } from "@/app/data/provenance";
import { getSource } from "@/app/data/sources";
import { formatIsoDate } from "@/app/lib/format";

/**
 * Where a record or a single field came from: its status, the named source, a
 * link to the exact page, and when it was last checked. Real and demo records
 * both flow through this, so nothing can be displayed without it.
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
    <div className={`text-xs leading-relaxed text-ink-500 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {showBadge ? <VerificationBadge status={status} /> : null}

        {source ? (
          <span>
            <span className="text-ink-500">Source</span>{" "}
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded font-medium text-ink-700 underline decoration-ink-300 underline-offset-2 transition-colors hover:text-brand-700 hover:decoration-brand-400"
              >
                {source.name}
              </a>
            ) : (
              <span className="font-medium text-ink-700">{source.name}</span>
            )}
          </span>
        ) : (
          <span className="text-ink-500">No source</span>
        )}

        <span aria-hidden="true" className="text-ink-300">
          &middot;
        </span>

        <span>
          <span className="text-ink-500">Last verified</span>{" "}
          <span className="font-medium text-ink-700" data-numeric>
            {checked ?? "never"}
          </span>
        </span>
      </div>

      {note ? (
        <p className="mt-2 border-l-2 border-ink-200 pl-3 text-ink-500">
          {note}
        </p>
      ) : null}
    </div>
  );
}
