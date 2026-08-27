import type { Metadata } from "next";
import Link from "next/link";

import { LinkButton } from "@/app/components/Button";
import Callout from "@/app/components/Callout";
import HospitalFilters from "@/app/components/HospitalFilters";
import HospitalListItem from "@/app/components/HospitalListItem";
import NotTheInsurerNotice from "@/app/components/NotTheInsurerNotice";
import PageHeader from "@/app/components/PageHeader";
import { getSource } from "@/app/data/sources";
import {
  HOSPITALS_WITH_CONFIRMED_EMERGENCY,
  TOTAL_REAL_HOSPITALS,
  describeHospitalQuery,
  isDefaultHospitalQuery,
  listHospitals,
  parseHospitalQuery,
} from "@/app/lib/hospitals";

export const metadata: Metadata = {
  title: "Find a hospital",
  description:
    "Real Chennai hospitals empanelled under Tamil Nadu's CMCHIS scheme, each listed with its source and verification status.",
};

function summarise(count: number, filters: string[]): string {
  const noun = count === 1 ? "hospital" : "hospitals";

  if (filters.length === 0) {
    return `Showing all ${count} ${noun} in the dataset.`;
  }

  return `${count} ${noun} ${count === 1 ? "matches" : "match"} ${filters.join(", ")}.`;
}

export default async function HospitalsPage(props: PageProps<"/hospitals">) {
  const query = parseHospitalQuery(await props.searchParams);
  const results = await listHospitals(query);
  const filters = describeHospitalQuery(query);
  const source = getSource("cmchis-empanelled-hospitals");

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow="Chennai, Tamil Nadu"
        title="Find a hospital"
        intro={
          <p>
            {TOTAL_REAL_HOSPITALS} real hospitals, taken from the Government of
            Tamil Nadu&apos;s published list of hospitals empanelled under the
            CMCHIS scheme. Every record shows where it came from and what has
            actually been checked.
          </p>
        }
      />

      <NotTheInsurerNotice className="mt-8 max-w-3xl" />

      <Callout
        tone="info"
        title="What this list can and cannot tell you"
        className="mt-4 max-w-3xl"
      >
        <p>
          <strong>It can tell you</strong> that these hospitals exist, that the
          Tamil Nadu government lists them as empanelled under CMCHIS, and
          whether they are government or private.
        </p>

        <p>
          <strong>It cannot tell you</strong> whether a private insurer covers
          you at these hospitals. Network lists are per insurer and per policy
          and change constantly, so every private insurer relationship here reads
          &quot;Not verified&quot;. Check your own insurer&apos;s network lookup,
          or call the hospital&apos;s insurance desk.
        </p>

        <p>
          Emergency care is confirmed for{" "}
          {HOSPITALS_WITH_CONFIRMED_EMERGENCY} of {TOTAL_REAL_HOSPITALS}{" "}
          hospitals — that is how many we could check against the hospital&apos;s
          own website. Unknown never means &quot;no&quot;.
        </p>
      </Callout>

      <div className="mt-10">
        <HospitalFilters query={query} />
      </div>

      <section aria-labelledby="results-heading" className="mt-10">
        <h2 id="results-heading" className="sr-only">
          Results
        </h2>

        <p aria-live="polite" className="text-sm text-ink-600">
          {summarise(results.length, filters)}
        </p>

        {results.length > 0 ? (
          <ul className="mt-4 surface divide-y divide-ink-200 overflow-hidden rounded-xl">
            {results.map((hospital) => (
              <HospitalListItem key={hospital.id} hospital={hospital} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-ink-300 bg-white p-8">
            <h3 className="font-semibold text-ink-900">
              No hospitals in this dataset match those filters
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
              This dataset holds {TOTAL_REAL_HOSPITALS} Chennai hospitals from
              one government list — it is not every hospital in the city. A
              hospital missing from here has not been ruled out; it simply is not
              in the list we have checked.
            </p>

            {isDefaultHospitalQuery(query) ? null : (
              <LinkButton href="/hospitals" className="mt-5">
                Clear filters
              </LinkButton>
            )}
          </div>
        )}
      </section>

      <section className="mt-12 max-w-3xl surface rounded-xl bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-ink-900">
          Where this list comes from
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {source.name}, published by {source.publisher}.{" "}
          {source.authoritativeFor}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              Read the official list
            </a>
          ) : null}

          <Link
            href="/trust"
            className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            How we label data
          </Link>

          <Link
            href="/claims"
            className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            What to ask before admission
          </Link>
        </div>
      </section>
    </div>
  );
}
