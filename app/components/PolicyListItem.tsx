import Link from "next/link";

import VerificationBadge from "@/app/components/VerificationBadge";
import { insurerName } from "@/app/data/demo/insurers";
import { describeRoomRent, type Policy } from "@/app/data/demo/policies";
import { formatInr } from "@/app/lib/format";

/**
 * The four facts appear in the same order for every policy, which is what makes
 * the list scannable as a comparison without needing a wide table.
 */
function keyFacts(policy: Policy) {
  return [
    { label: "Sum insured", value: formatInr(policy.sumInsured) },
    { label: "Room rent", value: describeRoomRent(policy) },
    {
      label: "Co-payment",
      value:
        policy.coPaymentPercent > 0
          ? `${policy.coPaymentPercent}% of every approved claim`
          : "None",
    },
    {
      label: "Deductible",
      value:
        policy.deductible > 0
          ? `${formatInr(policy.deductible)} before the policy pays`
          : "None",
    },
  ];
}

export default function PolicyListItem({ policy }: { policy: Policy }) {
  return (
    <li>
      <Link
        href={`/demo-policies/${policy.id}`}
        className="focus-ring block px-5 py-5 transition-colors hover:bg-slate-50 sm:px-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="text-base font-semibold text-slate-900">
            {policy.name}
          </h3>

          <VerificationBadge status={policy.provenance.status} />
        </div>

        <p className="mt-1 text-sm text-slate-600">
          {insurerName(policy.insurerId)} · {policy.type} · {policy.claimType}
        </p>

        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {keyFacts(policy).map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs uppercase tracking-wide text-slate-600">
                {fact.label}
              </dt>
              <dd className="mt-0.5 text-sm text-slate-900">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Link>
    </li>
  );
}
