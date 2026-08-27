import Link from "next/link";

import VerificationBadge from "@/app/components/VerificationBadge";
import { SCHEMES } from "@/app/data/real/relationships";
import type { HospitalRecord } from "@/app/lib/hospitals";

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
        className="focus-ring block px-5 py-5 transition-colors hover:bg-slate-50 sm:px-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="text-base font-semibold text-slate-900">
            {hospital.name}
          </h3>

          <VerificationBadge status={hospital.provenance.status} />
        </div>

        <p className="mt-1 text-sm text-slate-600">
          {hospital.area.value ? `${hospital.area.value}, ` : ""}
          {hospital.city}, {hospital.state} ·{" "}
          {hospital.ownership === "government" ? "Government" : "Private"} ·{" "}
          {hospital.category}
        </p>

        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-slate-500">Emergency care</dt>
            <dd className="font-medium text-slate-800">
              {hospital.emergency.value === true
                ? "Confirmed by the hospital"
                : "Not verified"}
            </dd>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <dt className="text-slate-500">Government scheme</dt>
            <dd className="font-medium text-slate-800">
              {schemes.length > 0
                ? `Empanelled under ${schemes.join(", ")}`
                : "Not verified"}
            </dd>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <dt className="text-slate-500">Private insurer network</dt>
            <dd className="font-medium text-slate-800">Not verified</dd>
          </div>
        </dl>
      </Link>
    </li>
  );
}
