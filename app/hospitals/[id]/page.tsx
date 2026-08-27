import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Callout from "@/app/components/Callout";
import FactRow from "@/app/components/FactRow";
import NotTheInsurerNotice from "@/app/components/NotTheInsurerNotice";
import PageHeader from "@/app/components/PageHeader";
import ProvenanceNote from "@/app/components/ProvenanceNote";
import VerificationBadge from "@/app/components/VerificationBadge";
import { INSURERS } from "@/app/data/real/products";
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
    description: `${hospital.name}, ${hospital.city}. Source, verification status, and what is known about insurance cover.`,
  };
}

export default async function HospitalDetailsPage(
  props: PageProps<"/hospitals/[id]">,
) {
  const { id } = await props.params;
  const hospital = await getHospital(id);

  if (!hospital) {
    notFound();
  }

  const schemeRelationships = hospital.relationships.filter(
    (relationship) => relationship.subject.kind === "scheme",
  );

  const ownershipLabel =
    hospital.ownership === "government" ? "Government" : "Private";

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/hospitals"
        className="focus-ring rounded text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← All hospitals
      </Link>

      <div className="mt-6">
        <PageHeader
          eyebrow={`${ownershipLabel} · ${hospital.category}`}
          title={hospital.name}
          intro={
            <p>
              {hospital.area.value ? `${hospital.area.value}, ` : ""}
              {hospital.city}, {hospital.state}
            </p>
          }
        />
      </div>

      <div className="mt-5 surface rounded-xl bg-white p-4">
        <ProvenanceNote provenance={hospital.provenance} />

        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          Name as published by the source:{" "}
          <span className="font-mono">{hospital.nameAsPublished}</span>
        </p>

        <p className="mt-1 text-xs leading-relaxed text-ink-500">
          We tidy spacing and capitalisation for display, but never change the
          words.
        </p>
      </div>

      <NotTheInsurerNotice className="mt-8" />

      <section aria-labelledby="details-heading" className="mt-12">
        <h2
          id="details-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          What we know
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Each field carries its own source. Where something could not be
          confirmed it says so, rather than being filled in with a guess.
        </p>

        <dl className="mt-5 surface grid gap-px overflow-hidden rounded-xl bg-ink-200">
          <div className="bg-white p-4 sm:p-5">
            <dt className="text-sm text-ink-500">City and state</dt>
            <dd className="mt-1 font-medium text-ink-900">
              {hospital.city}, {hospital.state}
            </dd>
            <ProvenanceNote provenance={hospital.provenance} className="mt-2" />
          </div>

          <FactRow label="Area" fact={hospital.area} />

          <FactRow label="Street address" fact={hospital.address} />

          <div className="bg-white p-4 sm:p-5">
            <dt className="text-sm text-ink-500">Hospital type</dt>
            <dd className="mt-1 font-medium text-ink-900">
              {hospital.category} · {ownershipLabel}
            </dd>
            <ProvenanceNote provenance={hospital.provenance} className="mt-2" />
          </div>

          <FactRow
            label="Emergency care"
            fact={hospital.emergency}
            render={(value) =>
              value ? "Confirmed by the hospital" : "Stated as not available"
            }
          />

          <FactRow
            label="Official website"
            fact={hospital.officialWebsite}
            render={(value) => (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded break-all underline underline-offset-2"
              >
                {value}
              </a>
            )}
          />
        </dl>
      </section>

      <section aria-labelledby="cover-heading" className="mt-12">
        <h2
          id="cover-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          Insurance and network status
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Whether a product exists and whether a hospital accepts it are two
          separate facts. The second is only recorded when an official source
          establishes it.
        </p>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-ink-500">
          Government schemes
        </h3>

        {schemeRelationships.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {schemeRelationships.map((relationship) => {
              if (relationship.subject.kind !== "scheme") return null;
              const scheme = SCHEMES[relationship.subject.schemeId];

              return (
                <li
                  key={relationship.id}
                  className="surface rounded-xl p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <p className="font-medium text-ink-900">
                      {scheme.shortName} — empanelled
                    </p>

                    <VerificationBadge status={relationship.provenance.status} />
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {scheme.name}, {scheme.operator}. {scheme.description}
                  </p>

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
          <p className="mt-3 text-ink-600">
            No scheme empanelment is recorded for this hospital.
          </p>
        )}

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-ink-500">
          Private insurers
        </h3>

        <p className="mt-3 leading-relaxed text-ink-600">
          Network status is <strong>Not verified</strong> for every private
          insurer at this hospital. No official network list has been read, so no
          claim is made either way — for or against.
        </p>

        <ul className="mt-4 surface divide-y divide-ink-200 overflow-hidden rounded-xl">
          {Object.values(INSURERS).map((insurer) => (
            <li
              key={insurer.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5"
            >
              <span className="text-sm text-ink-800">{insurer.name}</span>
              <VerificationBadge status="not-verified" />
            </li>
          ))}
        </ul>

        <Callout tone="info" title="How to actually find out" className="mt-6">
          <p>
            Ask your insurer directly, through their own network hospital lookup
            or their helpline, and give them your policy number — network status
            can differ between two policies from the same insurer. Then confirm
            with the hospital&apos;s insurance desk before admission.
          </p>

          <p>
            <Link
              href="/claims"
              className="focus-ring rounded font-medium underline underline-offset-4"
            >
              What to ask, and what to bring
            </Link>
          </p>
        </Callout>
      </section>

      <Link
        href="/hospitals"
        className="focus-ring mt-10 inline-block rounded text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← All hospitals
      </Link>
    </div>
  );
}
