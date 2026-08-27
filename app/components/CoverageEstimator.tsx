"use client";

import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/app/components/Button";
import { FIELD_CONTROL, FIELD_HINT, FIELD_LABEL } from "@/app/components/Field";
import {
  EMPTY_COVERAGE_INPUT,
  estimateCoverage,
  validateCoverage,
  type CoverageField,
  type RawCoverageInput,
} from "@/app/lib/coverage";
import { formatInr } from "@/app/lib/format";

function NumberField({
  field,
  label,
  hint,
  value,
  error,
  suffix,
  onChange,
}: {
  field: CoverageField;
  label: string;
  hint?: string;
  value: string;
  error?: string;
  suffix?: string;
  onChange: (field: CoverageField, value: string) => void;
}) {
  const hintId = hint ? `${field}-hint` : undefined;
  const errorId = error ? `${field}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={field} className={FIELD_LABEL}>
        {label}
      </label>

      <div className="relative">
        <input
          id={field}
          name={field}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`${FIELD_CONTROL} ${suffix ? "pr-10" : ""} ${
            error ? "border-red-600" : ""
          }`}
        />

        {suffix ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-500"
          >
            {suffix}
          </span>
        ) : null}
      </div>

      {hint ? (
        <p id={hintId} className={FIELD_HINT}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Fieldset({
  legend,
  description,
  children,
}: {
  legend: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-base font-semibold text-ink-900">
        {legend}
      </legend>

      {description ? (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-600">
          {description}
        </p>
      ) : null}

      <div className="mt-4 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export default function CoverageEstimator({
  initialValues,
  prefillNote,
}: {
  initialValues?: Partial<RawCoverageInput>;
  /** Explains where prefilled figures came from, when they were prefilled. */
  prefillNote?: string;
}) {
  const initial: RawCoverageInput = {
    ...EMPTY_COVERAGE_INPUT,
    ...initialValues,
  };

  const [raw, setRaw] = useState<RawCoverageInput>(initial);

  const { errors, input } = useMemo(() => validateCoverage(raw), [raw]);
  const estimate = useMemo(
    () => (input ? estimateCoverage(input) : null),
    [input],
  );

  function update(field: CoverageField, value: string) {
    setRaw((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setRaw(initial);
  }

  const fieldProps = (field: CoverageField) => ({
    field,
    value: raw[field],
    error: errors[field],
    onChange: update,
  });

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <form
        noValidate
        onSubmit={(event) => event.preventDefault()}
        className="space-y-8"
      >
        {prefillNote ? (
          <p className="surface rounded-xl bg-white p-4 text-sm leading-relaxed text-ink-600">
            {prefillNote}
          </p>
        ) : null}

        <Fieldset legend="Your situation">
          <NumberField
            {...fieldProps("bill")}
            label="Expected hospital bill"
            hint="The full amount you expect the hospital to charge."
          />

          <NumberField
            {...fieldProps("sumInsured")}
            label="Sum insured"
            hint="The most your policy pays in a policy year."
          />
        </Fieldset>

        <Fieldset
          legend="What your policy takes off"
          description="Leave a field blank or at zero if your policy does not have it."
        >
          <NumberField
            {...fieldProps("deductible")}
            label="Deductible"
            hint="What you pay before the policy pays anything."
          />

          <NumberField
            {...fieldProps("coPaymentPercent")}
            label="Co-payment"
            suffix="%"
            hint="Your share of every approved claim."
          />
        </Fieldset>

        <Fieldset
          legend="Room rent (optional)"
          description="Fill in all three to see how a room-rent limit can reduce a claim. This is the step that surprises people most."
        >
          <NumberField
            {...fieldProps("nights")}
            label="Nights in hospital"
          />

          <NumberField
            {...fieldProps("roomRatePerNight")}
            label="Room cost per night"
          />

          <NumberField
            {...fieldProps("roomRentLimitPerNight")}
            label="Policy room limit per night"
            hint="Your policy's cap on the room charge."
          />
        </Fieldset>

        <Button type="button" variant="secondary" onClick={reset}>
          Reset
        </Button>
      </form>

      <section
        aria-labelledby="estimate-heading"
        className="rounded-md border border-ink-200 lg:sticky lg:top-6"
      >
        <div className="border-b border-ink-200 px-5 py-4">
          <h2
            id="estimate-heading"
            className="text-base font-semibold text-ink-900"
          >
            Illustrative estimate
          </h2>
        </div>

        {estimate ? (
          <div className="px-5 py-5">
            <p aria-live="polite" className="text-sm text-ink-600">
              On these figures and assumptions, the policy might pay{" "}
              <strong
                className="font-semibold text-ink-900"
                data-numeric
              >
                {formatInr(estimate.insurerPays)}
              </strong>{" "}
              and leave{" "}
              <strong
                className="font-semibold text-ink-900"
                data-numeric
              >
                {formatInr(estimate.youPay)}
              </strong>{" "}
              for you. This is not a quote and not an approval.
            </p>

            <h3 className="mt-6 text-sm font-semibold text-ink-900">
              How that was worked out
            </h3>

            <ol className="mt-3 divide-y divide-ink-200 border-y border-ink-200">
              {estimate.steps.map((step) => (
                <li key={step.id} className="py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-ink-900">
                      {step.label}
                    </span>

                    <span className="shrink-0 text-sm tabular-nums text-ink-900">
                      {formatInr(step.runningTotal)}
                    </span>
                  </div>

                  {step.reduction > 0 ? (
                    <p className="mt-0.5 text-sm text-red-700" data-numeric>
                      −{formatInr(step.reduction)}
                    </p>
                  ) : null}

                  <p className="mt-1 text-sm leading-relaxed text-ink-600">
                    {step.explanation}
                  </p>
                </li>
              ))}
            </ol>

            {estimate.notes.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {estimate.notes.map((note) => (
                  <li key={note} className="text-sm leading-relaxed text-ink-600">
                    {note}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm leading-relaxed text-ink-600">
            Enter an expected hospital bill and your sum insured to see an
            estimate. Nothing you type is sent anywhere — the calculation runs
            in your browser.
          </p>
        )}
      </section>
    </div>
  );
}
