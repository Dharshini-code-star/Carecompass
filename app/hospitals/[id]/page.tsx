import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FactRow from "@/app/components/FactRow";
import NotTheInsurerNotice from "@/app/components/NotTheInsurerNotice";
import PageHeader from "@/app/components/PageHeader";
import ProvenanceNote from "@/app/components/ProvenanceNote";
import VerificationBadge from "@/app/components/VerificationBadge";
import { SCHEMES } from "@/app/data/real/relationships";
import { getHospital, listHospitalIds } from "@/app/lib/hospitals";

export async function generateStaticParams() {
  const ids = await listHospitalIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata(
  props: PageProps<"/hospitals/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const hospital = await getHospital(id);

  if (!hospital) return { title: "Hospital not found" };

  return {
    title: hospital.name,
    description: hospital.name + ", " + hospital.city + ". Source, verification status and hospital information.",
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-ink-200 py-4 first:border-t-0 first:pt-0">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="mt-1 font-medium text-ink-900">{value}</dd>
    </div>
  );
}

export default async function HospitalDetailsPage(
  props: PageProps<"/hospitals/[id]">,
) {
  const { id } = await props.params;
  const hospital = await getHospital(id);

  if (!hospital) notFound();

  const schemeRelationships = hospital.relationships.filter(
    (relationship) => relationship.subject.kind === "scheme",
  );
  const ownershipLabel =
    hospital.ownership === "government" ? "Government" : "Private";

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href="/hospitals"
        className="focus-ring rounded text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
      >
        All hospitals
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow={ownershipLabel + " | " + hospital.category}
          title={hospital.name}
          intro={
            <p>
              {(hospital.area.value ? hospital.area.value + ", " : "") +
                hospital.city +
                ", " +
                hospital.state}
            </p>
          }
        />
        <VerificationBadge status={hospital.provenance.status} />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <section className="surface rounded-lg bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Overview</h2>
          <dl className="mt-5">
            <InfoRow label="Location" value={(hospital.area.value ? hospital.area.value + ", " : "") + hospital.city} />
            <InfoRow label="Hospital type" value={hospital.category + " | " + ownershipLabel} />
            <InfoRow label="Published name" value={hospital.nameAsPublished} />
          </dl>
        </section>

        <section className="surface rounded-lg bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Verification</h2>
          <p className="mt-2 text-sm text-ink-600">
            Check the source before making a care decision.
          </p>
          <ProvenanceNote provenance={hospital.provenance} className="mt-5" />
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="surface rounded-lg bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Facilities</h2>
          <dl className="mt-5 grid gap-px overflow-hidden rounded-lg border border-ink-200 bg-ink-200">
            <div className="bg-white p-4">
              <dt className="text-sm text-ink-500">ICU</dt>
              <dd className="mt-1 font-medium text-ink-900">Unknown</dd>
              <p className="mt-1 text-sm text-ink-500">No verified source available.</p>
            </div>
            <FactRow
              label="Official website"
              fact={hospital.officialWebsite}
              render={(value) => (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring rounded break-all text-brand-700 underline underline-offset-2"
                >
                  Open official website
                </a>
              )}
            />
          </dl>
        </section>

        <section className="surface rounded-lg bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Emergency</h2>
          <dl className="mt-5 grid gap-px overflow-hidden rounded-lg border border-ink-200 bg-ink-200">
            <FactRow
              label="Emergency information"
              fact={hospital.emergency}
              render={(value) => (value ? "Verified" : "Stated as unavailable")}
            />
            <FactRow label="Street address" fact={hospital.address} />
          </dl>
        </section>
      </div>

      <section className="surface mt-4 rounded-lg bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">Insurance</h2>
          <Link
            href="/insurance"
            className="focus-ring rounded text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Explore insurance records
          </Link>
        </div>

        {schemeRelationships.length > 0 ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {schemeRelationships.map((relationship) => {
              if (relationship.subject.kind !== "scheme") return null;
              const scheme = SCHEMES[relationship.subject.schemeId];

              return (
                <li key={relationship.id} className="rounded-lg border border-ink-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="font-medium text-ink-900">{scheme.shortName}</span>
                    <VerificationBadge status={relationship.provenance.status} />
                  </div>
                  <p className="mt-2 text-sm text-ink-600">Government scheme listed.</p>
                  <ProvenanceNote
                    provenance={relationship.provenance}
                    showBadge={false}
                    className="mt-3"
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-ink-600">Unknown - no verified source available.</p>
        )}

        <div className="mt-5 border-t border-ink-200 pt-5">
          <h3 className="text-sm font-semibold">Private insurer network</h3>
          <p className="mt-1 text-sm text-ink-600">
            Unknown - no verified source available. Confirm directly with your insurer.
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <NotTheInsurerNotice />
        <Link
          href={"/compare?first=" + hospital.id}
          className="focus-ring inline-flex min-h-11 items-center justify-center self-start rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 lg:self-auto"
        >
          Compare hospital
        </Link>
      </section>
    </div>
  );
}
