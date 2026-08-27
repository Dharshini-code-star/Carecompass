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

/**
 * A plain GET form rather than client-side state.
 *
 * Filters apply only when Search is pressed, the result is a shareable and
 * bookmarkable URL the back button understands, and the page still works if
 * JavaScript fails — which is exactly the situation someone on hospital wifi
 * may be in.
 */
export default function HospitalFilters({ query }: { query: HospitalQuery }) {
  /*
    The controls are uncontrolled, so React keeps whatever the DOM already holds
    across a client-side navigation. Keying the form on the query remounts them
    whenever the query changes, so the form always agrees with the URL.
  */
  const formKey = `${query.q}|${query.area}|${query.ownership}|${query.emergencyConfirmedOnly}`;

  return (
    <form
      key={formKey}
      method="GET"
      // Stops the browser restoring stale control values on a back navigation,
      // which would leave the form disagreeing with the results below it.
      autoComplete="off"
      action="/hospitals"
      aria-labelledby="filters-heading"
      className="surface rounded-xl bg-white p-5 sm:p-6"
    >
      <h2 id="filters-heading" className="text-base font-semibold text-ink-900">
        Narrow the list
      </h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="q" className={FIELD_LABEL}>
            Hospital name
          </label>

          <input
            type="search"
            id="q"
            name="q"
            defaultValue={query.q}
            placeholder="e.g. Kauvery"
            className={FIELD_CONTROL}
          />
        </div>

        <SelectField
          id="area"
          name="area"
          label="Area"
          options={AREA_OPTIONS}
          defaultValue={query.area}
          hint="Only areas the source names are listed."
        />

        <SelectField
          id="ownership"
          name="ownership"
          label="Government or private"
          options={OWNERSHIP_OPTIONS}
          defaultValue={query.ownership}
        />
      </div>

      <div className="mt-5">
        <CheckboxField
          id="emergency"
          name="emergency"
          label="Only where emergency care is confirmed by the hospital"
          defaultChecked={query.emergencyConfirmedOnly}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" variant="primary">
          Search
        </Button>

        <LinkButton href="/hospitals">Clear filters</LinkButton>
      </div>
    </form>
  );
}
