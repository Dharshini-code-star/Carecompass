import VerificationBadge from "@/app/components/VerificationBadge";
import type { Provenance } from "@/app/data/provenance";
import { getSource } from "@/app/data/sources";
import { formatIsoDate } from "@/app/lib/format";

function sourceType(kind: string) {
  return kind === "official-site"
    ? "Official hospital information"
    : kind === "government"
      ? "Government source"
      : kind === "regulator"
        ? "Regulator"
        : kind === "demo"
          ? "Demo data"
          : "Source";
}

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
    <div className={["text-xs text-ink-500", className].join(" ")}>
      <div className="flex flex-wrap items-center gap-2">
        {showBadge ? <VerificationBadge status={status} /> : null}
        <details className="group">
          <summary className="focus-ring cursor-pointer list-none rounded font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
            View evidence
          </summary>
          <dl className="mt-3 grid gap-2 border-l-2 border-ink-200 pl-3 leading-relaxed">
            <div>
              <dt className="inline text-ink-500">Source: </dt>
              <dd className="inline font-medium text-ink-700">
                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring rounded underline decoration-ink-300 underline-offset-2 hover:text-brand-700"
                  >
                    {source?.name ?? "Source link"}
                  </a>
                ) : (
                  source?.name ?? "No verified source available"
                )}
              </dd>
            </div>
            <div>
              <dt className="inline text-ink-500">Source type: </dt>
              <dd className="inline text-ink-700">
                {source ? sourceType(source.kind) : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="inline text-ink-500">Retrieved: </dt>
              <dd className="inline text-ink-700" data-numeric>
                {checked ?? "Unknown"}
              </dd>
            </div>
            {note ? (
              <div>
                <dt className="inline text-ink-500">Relevant information: </dt>
                <dd className="inline text-ink-700">{note}</dd>
              </div>
            ) : null}
          </dl>
        </details>
      </div>
    </div>
  );
}
