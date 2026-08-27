import type { Metadata } from "next";
import Link from "next/link";

import { Button, LinkButton } from "@/app/components/Button";
import Callout from "@/app/components/Callout";
import {
  AlternativeCard,
  ComparisonTable,
} from "@/app/components/EscalationResults";
import { SelectField } from "@/app/components/Field";
import PageHeader from "@/app/components/PageHeader";
import { FACILITY_STATUS_LABELS, getFacility } from "@/app/data/facilities";
import { URGENCY_LABELS, type Urgency } from "@/app/lib/escalation";
import {
  coverageOptions,
  FACILITY_OPTIONS,
  coverageValue,
  hospitalOptions,
  parseEscalationQuery,
  runEscalation,
} from "@/app/lib/hospital-escalation";

export const metadata: Metadata = {
  title: "Check a facility",
  description:
    "Check whether the facility you need appears to be available at your current hospital, and see other hospitals that appear to have it.",
};

const URGENCY_OPTIONS = (["normal", "high", "critical"] as Urgency[]).map(
  (value) => ({ value, label: URGENCY_LABELS[value] }),
);

const RADIUS_OPTIONS = [
  { value: "", label: "Any distance" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
  { value: "15", label: "Within 15 km" },
];

const DATASET_OPTIONS = [
  { value: "real", label: "Real records (Chennai, government-sourced)" },
  { value: "demo", label: "Demo scenario (invented — shows how ranking works)" },
];

export default async function FacilityCheckPage(
  props: PageProps<"/facility-check">,
) {
  const params = await props.searchParams;
  const query = parseEscalationQuery(params);
  const result = await runEscalation(query);
  const facility = getFacility(query.facilityId);
  const hospitals = hospitalOptions(query.dataset);
  const isDemo = query.dataset === "demo";

  const withFacility = result.alternatives.filter(
    (alternative) => alternative.facilityStatus === "available",
  );
  const shown = withFacility.length > 0 ? withFacility : result.alternatives;
  const best = shown[0];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow="Facility check"
        title="Does this hospital have what you need?"
        intro={
          <p>
            Choose the facility you need and the hospital you are at. We will
            say what the available data shows — including when it shows nothing
            — and list other hospitals that appear to have it.
          </p>
        }
      />

      <Callout
        tone="caution"
        title="Information support, not medical advice"
        className="mt-8"
      >
        <p>{result.safety}</p>
        <p>
          InsureGuide does not know anyone&apos;s condition and never decides
          where someone should be treated. Any move between hospitals is a
          decision for the treating medical team.
        </p>
      </Callout>

      <form
        method="GET"
        action="/facility-check"
        autoComplete="off"
        aria-labelledby="check-heading"
        className="surface mt-8 rounded-xl p-5 sm:p-6"
        key={`${query.dataset}|${query.facilityId}|${query.urgency}|${query.currentHospitalId}`}
      >
        <h2 id="check-heading" className="text-base font-semibold text-ink-900">
          What do you need, and where are you?
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <SelectField
            id="dataset"
            name="dataset"
            label="Data set"
            options={DATASET_OPTIONS}
            defaultValue={query.dataset}
            hint="Real records hold no facility inventory yet. The demo scenario is invented and exists only to show the ranking working."
          />

          <SelectField
            id="facility"
            name="facility"
            label="Facility you need"
            options={FACILITY_OPTIONS}
            defaultValue={query.facilityId}
            hint={facility?.description}
          />

          <SelectField
            id="current"
            name="current"
            label="Hospital you are at"
            options={[
              { value: "", label: "Not specified" },
              ...hospitals.map((h) => ({ value: h.id, label: h.label })),
            ]}
            defaultValue={query.currentHospitalId ?? ""}
          />

          <SelectField
            id="coverage"
            name="coverage"
            label="Your cover"
            options={coverageOptions(query.dataset)}
            defaultValue={coverageValue(query.coverage)}
          />

          <SelectField
            id="urgency"
            name="urgency"
            label="Urgency"
            options={URGENCY_OPTIONS}
            defaultValue={query.urgency}
            hint="At critical urgency, capability and travel time outweigh insurance."
          />

          <SelectField
            id="radius"
            name="radius"
            label="Search radius"
            options={RADIUS_OPTIONS}
            defaultValue={query.maxRadiusKm ? String(query.maxRadiusKm) : ""}
            hint="Hospitals with unknown distance are never filtered out."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="submit" variant="primary">
            Check availability
          </Button>
          <LinkButton href="/facility-check">Reset</LinkButton>
        </div>
      </form>

      {isDemo ? (
        <Callout
          tone="caution"
          title="DEMO DATA — NOT FOR REAL-WORLD USE"
          className="mt-8"
        >
          <p>
            These hospitals do not exist. Their facilities, coordinates and
            insurance links are invented so the ranking can be seen working.
            Nothing here may be used to decide where to go.
          </p>
        </Callout>
      ) : null}

      {result.assessment && result.currentHospital ? (
        <section aria-labelledby="current-heading" className="mt-10">
          <h2
            id="current-heading"
            className="text-xl font-semibold tracking-tight text-ink-900"
          >
            At {result.currentHospital.name}
          </h2>

          <div
            className={`mt-4 rounded-xl border p-5 shadow-xs sm:p-6 ${
              result.assessment.outcome === "facility-available"
                ? "border-brand-200 bg-brand-50"
                : "border-caution-200 bg-caution-50"
            }`}
          >
            <p className="font-semibold text-ink-900">
              {result.assessment.headline}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {result.assessment.detail}
            </p>
          </div>
        </section>
      ) : (
        <Callout tone="info" title="Tell us where you are" className="mt-10">
          <p>
            Select the hospital you are at above and we will check that facility
            against its record first, before showing anything else.
          </p>
        </Callout>
      )}

      {result.dataGap && !isDemo ? (
        <Callout
          tone="caution"
          title="We hold no facility data for these hospitals"
          className="mt-8"
        >
          <p>
            Our hospital records come from the Tamil Nadu government&apos;s
            CMCHIS empanelment list, which publishes names, districts and
            ownership — not facilities. We have not obtained a facility
            inventory from any official source, so every hospital below reads{" "}
            <strong>{FACILITY_STATUS_LABELS.unknown}</strong> for{" "}
            {result.facilityName}.
          </p>
          <p>
            We could fill this in from a directory or a hospital&apos;s
            marketing page. We do not, because a stale or scraped answer to
            &quot;does this hospital have an ICU&quot; is worse than an honest
            &quot;we do not know&quot;. Ask the hospital directly, and use the
            demo scenario above to see how the ranking behaves.
          </p>
        </Callout>
      ) : null}

      {best && result.assessment?.offerEscalation && result.currentHospital &&
      result.currentStatus ? (
        <section aria-labelledby="compare-heading" className="mt-12">
          <h2
            id="compare-heading"
            className="text-xl font-semibold tracking-tight text-ink-900"
          >
            Side by side
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
            Your current hospital against the highest-ranked alternative.
          </p>

          <div className="mt-4">
            <ComparisonTable
              facilityName={result.facilityName}
              current={result.currentHospital}
              currentStatus={result.currentStatus}
              alternative={best}
            />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="alternatives-heading" className="mt-12">
        <h2
          id="alternatives-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          Other hospitals
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
          {withFacility.length > 0
            ? `${withFacility.length} ${withFacility.length === 1 ? "hospital appears" : "hospitals appear"} to have ${result.facilityName}, ranked by facility match first, then urgency, distance, insurance, capability and how far the data can be trusted.`
            : `No hospital in this data set is recorded as having ${result.facilityName}. The list below is ordered by what else is known — it is not a statement that these hospitals lack the facility.`}
        </p>

        {shown.length > 0 ? (
          <ul className="mt-6 grid gap-4">
            {shown.slice(0, 8).map((candidate, index) => (
              <AlternativeCard
                key={candidate.hospitalId}
                candidate={candidate}
                rank={index + 1}
                facilityName={result.facilityName}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-ink-300 bg-white p-8">
            <p className="font-semibold text-ink-900">
              No hospitals matched within that radius
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
              Try widening the search radius, or clearing it entirely.
            </p>
          </div>
        )}
      </section>

      <section className="surface mt-12 rounded-xl p-5 sm:p-6">
        <h2 className="font-semibold text-ink-900">How this ranking works</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          A hospital that appears to have the facility always ranks above one
          that does not — however close the second is, and however well its
          insurance matches. Within that, hospitals are scored on distance,
          insurance compatibility, confirmed capability and how far each claim
          can be trusted, weighted by the urgency you chose. Unknown is scored
          between yes and no, never as either.
        </p>
        <Link
          href="/trust"
          className="focus-ring mt-4 inline-block rounded text-sm font-semibold text-brand-700 underline underline-offset-4"
        >
          What our verification labels mean
        </Link>
      </section>
    </div>
  );
}
