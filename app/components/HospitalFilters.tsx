import { Button, LinkButton } from "@/app/components/Button";
import {
  CheckboxField,
  FIELD_CONTROL,
  FIELD_LABEL,
  SelectField,
} from "@/app/components/Field";
import {
  AREA_OPTIONS,
  OWNERSHIP_OPTIONS,
  type HospitalQuery,
} from "@/app/lib/hospitals";

export default function HospitalFilters({ query }: { query: HospitalQuery }) {
  const formKey = [query.q, query.area, query.ownership, query.emergencyConfirmedOnly].join("|");

  return (
    <form
      key={formKey}
      method="GET"
      autoComplete="off"
      action="/hospitals"
      aria-labelledby="filters-heading"
      className="surface rounded-lg bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="filters-heading" className="text-base font-semibold text-ink-900">
          Search and filters
        </h2>
        <span className="text-xs text-ink-500">Verified data only</span>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="q" className={FIELD_LABEL}>Hospital name</label>
          <input
            type="search"
            id="q"
            name="q"
            defaultValue={query.q}
            placeholder="Search by name"
            className={FIELD_CONTROL}
          />
        </div>

        <SelectField
          id="area"
          name="area"
          label="Location"
          options={AREA_OPTIONS}
          defaultValue={query.area}
        />

        <SelectField
          id="ownership"
          name="ownership"
          label="Care setting"
          options={OWNERSHIP_OPTIONS}
          defaultValue={query.ownership}
        />
      </div>

      <div className="mt-5">
        <CheckboxField
          id="emergency"
          name="emergency"
          label="Emergency information verified"
          defaultChecked={query.emergencyConfirmedOnly}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-500">
        <span>Insurance: shown where sourced</span>
        <span>Distance: unknown until coordinates are verified</span>
        <span>Verification: shown on every result</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" variant="primary">Search</Button>
        <LinkButton href="/hospitals">Clear filters</LinkButton>
      </div>
    </form>
  );
}
