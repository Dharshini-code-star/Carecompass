import Link from "next/link";

import VerificationBadge from "@/app/components/VerificationBadge";
import {
  FACILITY_STATUS_LABELS,
  type FacilityStatus,
} from "@/app/data/facilities";
import {
  INSURANCE_LABELS,
  type RankedCandidate,
} from "@/app/lib/escalation";

const FACILITY_TONE: Record<FacilityStatus, string> = {
  available: "bg-brand-50 text-brand-800 border-brand-200",
  "not-available": "bg-caution-50 text-caution-800 border-caution-200",
  unknown: "bg-ink-100 text-ink-700 border-ink-300",
};

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: FacilityStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] ${FACILITY_TONE[tone]}`}
    >
      {label}
    </span>
  );
}

function ReasonList({ reasons }: { reasons: RankedCandidate["reasons"] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {reasons.map((reason) => (
        <li key={reason.kind + reason.text} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
              reason.tone === "positive"
                ? "bg-brand-500"
                : reason.tone === "caution"
                  ? "bg-caution-300"
                  : "bg-ink-300"
            }`}
          />
          <span className="text-sm leading-relaxed text-ink-600">
            {reason.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

function distanceLabel(km: number | null): string {
  if (km === null) return "Distance unknown";
  return km < 10 ? `${km.toFixed(1)} km away` : `${Math.round(km)} km away`;
}

/**
 * One ranked alternative. The "Why this hospital?" block is not decoration —
 * a recommendation nobody can interrogate is not usable in this domain.
 */
export function AlternativeCard({
  candidate,
  rank,
  facilityName,
}: {
  candidate: RankedCandidate;
  rank: number;
  facilityName: string;
}) {
  return (
    <li className="surface rounded-xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-ink-400">
            Option {rank}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink-900">
            {candidate.name}
          </h3>
          {candidate.area ? (
            <p className="mt-1 text-sm text-ink-500">{candidate.area}</p>
          ) : null}
        </div>

        <VerificationBadge status={candidate.facilityTrust} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusPill
          tone={candidate.facilityStatus}
          label={`${facilityName}: ${FACILITY_STATUS_LABELS[candidate.facilityStatus]}`}
        />

        <span className="inline-flex items-center rounded-full border border-ink-300 bg-white px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-700">
          Insurance: {INSURANCE_LABELS[candidate.insurance]}
        </span>

        <span
          className="inline-flex items-center rounded-full border border-ink-300 bg-white px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-700"
          data-numeric
        >
          {distanceLabel(candidate.distanceKm)}
        </span>
      </div>

      <div className="mt-5 border-t border-ink-200 pt-4">
        <p className="text-sm font-semibold text-ink-900">Why this hospital?</p>
        <ReasonList reasons={candidate.reasons} />
      </div>
    </li>
  );
}

/**
 * The comparison the brief asks for: current hospital beside the best
 * alternative, so the reason for looking elsewhere is visible in one glance.
 */
export function ComparisonTable({
  facilityName,
  current,
  alternative,
  currentStatus,
}: {
  facilityName: string;
  current: { id: string; name: string };
  alternative: RankedCandidate;
  currentStatus: FacilityStatus;
}) {
  const rows: { factor: string; a: string; b: string }[] = [
    {
      factor: `${facilityName}`,
      a: FACILITY_STATUS_LABELS[currentStatus],
      b: FACILITY_STATUS_LABELS[alternative.facilityStatus],
    },
    {
      factor: "Insurance",
      a: "See current hospital record",
      b: INSURANCE_LABELS[alternative.insurance],
    },
    {
      factor: "Distance",
      a: "You are here",
      b: distanceLabel(alternative.distanceKm),
    },
  ];

  return (
    <div className="surface overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Comparison between your current hospital and the highest-ranked
            alternative
          </caption>
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50">
              <th scope="col" className="px-5 py-3 font-semibold text-ink-700">
                Factor
              </th>
              <th scope="col" className="px-5 py-3 font-semibold text-ink-700">
                {current.name}
              </th>
              <th scope="col" className="px-5 py-3 font-semibold text-ink-700">
                {alternative.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.factor} className="border-b border-ink-200 last:border-0">
                <th
                  scope="row"
                  className="px-5 py-3.5 font-medium text-ink-800"
                >
                  {row.factor}
                </th>
                <td className="px-5 py-3.5 text-ink-600">{row.a}</td>
                <td className="px-5 py-3.5 text-ink-600">{row.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-ink-200 bg-ink-50 px-5 py-3 text-xs leading-relaxed text-ink-500">
        Comparison of recorded data only. It is not a recommendation to move,
        and it does not describe how either hospital would treat any
        individual.{" "}
        <Link
          href="/trust"
          className="focus-ring rounded font-medium underline underline-offset-2"
        >
          How we label data
        </Link>
      </p>
    </div>
  );
}
