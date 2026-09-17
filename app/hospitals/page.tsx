import type { Metadata } from "next";
import Link from "next/link";

import { LinkButton } from "@/app/components/Button";
import HospitalFilters from "@/app/components/HospitalFilters";
import HospitalListItem from "@/app/components/HospitalListItem";
import NotTheInsurerNotice from "@/app/components/NotTheInsurerNotice";
import PageHeader from "@/app/components/PageHeader";
import {
  TOTAL_REAL_HOSPITALS,
  describeHospitalQuery,
  isDefaultHospitalQuery,
  listHospitals,
  parseHospitalQuery,
} from "@/app/lib/hospitals";

export const metadata: Metadata = {
  title: "Find a Hospital",
  description:
    "Search Chennai hospitals by location, care setting and verified emergency information.",
};

function summarise(count: number, filters: string[]): string {
  const noun = count === 1 ? "hospital" : "hospitals";
  return filters.length === 0
    ? String(count) + " hospitals in this dataset."
    : String(count) + " " + noun + " match " + filters.join(", ") + ".";
}

export default async function HospitalsPage(props: PageProps<"/hospitals">) {
  const query = parseHospitalQuery(await props.searchParams);
  const results = await listHospitals(query);
  const filters = describeHospitalQuery(query);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow="Chennai, Tamil Nadu"
        title="Find a Hospital"
        intro={<p>Search hospitals by location, care and insurance.</p>}
      />

      <div className="mt-8">
        <HospitalFilters query={query} />
      </div>

      <section aria-labelledby="results-heading" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="results-heading" className="text-lg font-semibold">
            Hospital results
          </h2>
          <p aria-live="polite" className="text-sm text-ink-600">
            {summarise(results.length, filters)}
          </p>
        </div>

        {results.length > 0 ? (
          <ul className="mt-5 grid gap-4 lg:grid-cols-2">
            {results.map((hospital) => (
              <HospitalListItem key={hospital.id} hospital={hospital} />
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-ink-300 bg-white p-8">
            <h3 className="font-semibold text-ink-900">No hospitals found.</h3>
            <p className="mt-2 text-sm text-ink-600">Try changing your filters.</p>
            {isDefaultHospitalQuery(query) ? null : (
              <LinkButton href="/hospitals" className="mt-5">Clear filters</LinkButton>
            )}
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <NotTheInsurerNotice />
        <Link
          href="/trust"
          className="focus-ring rounded text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
        >
          View data evidence
        </Link>
      </section>

      <p className="mt-6 text-xs text-ink-500">
        Dataset: {TOTAL_REAL_HOSPITALS} Chennai hospitals from the CMCHIS published list.
      </p>
    </div>
  );
}
