import Link from "next/link";

import VerificationBadge from "@/app/components/VerificationBadge";
import { SCHEMES } from "@/app/data/real/relationships";
import type { HospitalRecord } from "@/app/lib/hospitals";

function Fact({
  label,
  value,
  known,
}: {
  label: string;
  value: string;
  known: boolean;
}) {
  return (
    <div>
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm ${known ? "font-medium text-ink-800" : "text-ink-500"}`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function HospitalListItem({
  hospital,
}: {
  hospital: HospitalRecord;
}) {
  const schemes = hospital.relationships
    .filter((relationship) => relationship.subject.kind === "scheme")
    .map((relationship) =>
      relationship.subject.kind === "scheme"
        ? SCHEMES[relationship.subject.schemeId].shortName
        : null,
    )
    .filter(Boolean);

  return (
    <li>
      <Link
        href={`/hospitals/${hospital.id}`}
        className="focus-ring group block px-5 py-5 transition-colors hover:bg-ink-50 sm:px-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="text-base font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
            {hospital.name}
          </h3>

          <VerificationBadge status={hospital.provenance.status} />
        </div>

        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
          <span>
            {hospital.area.value ? `${hospital.area.value}, ` : ""}
            {hospital.city}
          </span>
          <span aria-hidden="true" className="text-ink-300">
            &middot;
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${
              hospital.ownership === "government"
                ? "bg-cite-50 text-cite-700"
                : "bg-ink-100 text-ink-600"
            }`}
          >
            {hospital.ownership === "government" ? "Government" : "Private"}
          </span>
          <span aria-hidden="true" className="text-ink-300">
            &middot;
          </span>
          <span>{hospital.category}</span>
        </p>

        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
          <Fact
            label="Emergency care"
            known={hospital.emergency.value === true}
            value={
              hospital.emergency.value === true
                ? "Confirmed by hospital"
                : "Not verified"
            }
          />
          <Fact
            label="Government scheme"
            known={schemes.length > 0}
            value={
              schemes.length > 0
                ? `Empanelled — ${schemes.join(", ")}`
                : "Not verified"
            }
          />
          <Fact
            label="Private insurer network"
            known={false}
            value="Not verified"
          />
        </dl>
      </Link>
    </li>
  );
}
