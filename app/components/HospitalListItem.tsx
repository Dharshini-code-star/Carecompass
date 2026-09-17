import Link from "next/link";

import VerificationBadge from "@/app/components/VerificationBadge";
import { SCHEMES } from "@/app/data/real/relationships";
import type { HospitalRecord } from "@/app/lib/hospitals";

function StatusLine({
  label,
  value,
  tone = "known",
}: {
  label: string;
  value: string;
  tone?: "known" | "unknown";
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span
        aria-hidden="true"
        className={["mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold", tone === "known" ? "bg-brand-100 text-brand-800" : "bg-ink-100 text-ink-600"].join(" ")}
      >
        {tone === "known" ? "+" : "?"}
      </span>
      <span className="text-ink-700">
        <span className="font-medium">{label}</span>
        <span className="text-ink-500"> {value}</span>
      </span>
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
    .filter((scheme): scheme is string => Boolean(scheme));

  const hasEmergency = hospital.emergency.value === true;

  return (
    <li className="surface rounded-lg bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink-900">{hospital.name}</h3>
          <p className="mt-1 text-sm text-ink-500">
            {hospital.area.value ? hospital.area.value + ", " : ""}{hospital.city}
          </p>
        </div>
        <VerificationBadge status={hospital.provenance.status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatusLine
          label="Insurance"
          value={schemes.length ? "scheme listed: " + schemes.join(", ") : "unknown"}
          tone={schemes.length ? "known" : "unknown"}
        />
        <StatusLine
          label="Emergency"
          value={hasEmergency ? "information verified" : "information unknown"}
          tone={hasEmergency ? "known" : "unknown"}
        />
        <StatusLine
          label="Care type"
          value={hospital.category + ", " + hospital.ownership}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={"/hospitals/" + hospital.id}
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          View Details
        </Link>
        <Link
          href={"/compare?first=" + hospital.id}
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-ink-300 bg-white px-4 text-sm font-semibold text-ink-800 transition hover:border-brand-300 hover:text-brand-800"
        >
          Compare
        </Link>
      </div>
    </li>
  );
}
