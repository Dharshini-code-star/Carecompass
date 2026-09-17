import type { Metadata } from "next";

import PageHeader from "@/app/components/PageHeader";
import ProvenanceNote from "@/app/components/ProvenanceNote";
import VerificationBadge from "@/app/components/VerificationBadge";
import { SCHEMES } from "@/app/data/real/relationships";
import { listHospitals, type HospitalRecord } from "@/app/lib/hospitals";

export const metadata: Metadata = {
  title: "Compare Hospitals",
  description: "Compare hospital information using the sources and verification states available in CareCompass.",
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function schemeNames(hospital: HospitalRecord) {
  return hospital.relationships
    .filter((relationship) => relationship.subject.kind === "scheme")
    .map((relationship) =>
      relationship.subject.kind === "scheme"
        ? SCHEMES[relationship.subject.schemeId].shortName
        : null,
    )
    .filter((name): name is string => Boolean(name));
}

function ValueRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink-200 py-4 first:border-t-0 first:pt-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium leading-relaxed text-ink-800">
        {children}
      </dd>
    </div>
  );
}

function ComparisonCard({ hospital }: { hospital: HospitalRecord }) {
  const schemes = schemeNames(hospital);
  return (
    <article className="surface rounded-lg bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">{hospital.name}</h2>
        <VerificationBadge status={hospital.provenance.status} />
      </div>
      <dl className="mt-6">
        <ValueRow label="Location">
          {(hospital.area.value ? hospital.area.value + ", " : "") + hospital.city}
        </ValueRow>
        <ValueRow label="Care / Facility">
          {hospital.category + ", " + hospital.ownership}
        </ValueRow>
        <ValueRow label="Insurance">
          {schemes.length ? "Scheme listed: " + schemes.join(", ") : "Unknown - no verified source available."}
        </ValueRow>
        <ValueRow label="Emergency">
          {hospital.emergency.value === true
            ? "Verified"
            : "Unknown - no verified source available."}
        </ValueRow>
        <ValueRow label="Official website">
          {hospital.officialWebsite.value ? (
            <a
              href={hospital.officialWebsite.value}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded break-all text-brand-700 underline underline-offset-2"
            >
              Open official website
            </a>
          ) : (
            "Unknown - no verified source available."
          )}
        </ValueRow>
      </dl>
      <ProvenanceNote provenance={hospital.provenance} className="mt-5 border-t border-ink-200 pt-4" />
    </article>
  );
}

export default async function ComparePage(props: PageProps<"/compare">) {
  const params = await props.searchParams;
  const hospitals = await listHospitals();
  const firstId = firstValue(params.first) ?? hospitals[0]?.id;
  const first = hospitals.find((hospital) => hospital.id === firstId) ?? hospitals[0];
  const secondId = firstValue(params.second);
  const second =
    hospitals.find((hospital) => hospital.id === secondId && hospital.id !== first.id) ??
    hospitals.find((hospital) => hospital.id !== first.id) ??
    first;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow="Evidence-led comparison"
        title="Compare Hospitals"
        intro={<p>Compare verified hospital information side by side.</p>}
      />

      <form method="GET" className="surface mt-8 grid gap-4 rounded-lg bg-white p-5 sm:grid-cols-2 sm:p-6">
        <label className="block">
          <span className="text-sm font-medium text-ink-700">First hospital</span>
          <select name="first" defaultValue={first.id} className="mt-2 w-full rounded-lg border border-ink-300 bg-white px-3 py-2.5 text-sm text-ink-800 outline-none focus:border-brand-600">
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-700">Second hospital</span>
          <select name="second" defaultValue={second.id} className="mt-2 w-full rounded-lg border border-ink-300 bg-white px-3 py-2.5 text-sm text-ink-800 outline-none focus:border-brand-600">
            {hospitals.filter((hospital) => hospital.id !== first.id).map((hospital) => (
              <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="focus-ring inline-flex min-h-11 items-center justify-center self-end rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:col-span-2 sm:justify-self-start">
          Compare hospitals
        </button>
      </form>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ComparisonCard hospital={first} />
        <ComparisonCard hospital={second} />
      </div>
    </div>
  );
}

