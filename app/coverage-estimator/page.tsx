import type { Metadata } from "next";
import Link from "next/link";

import Callout from "@/app/components/Callout";
import CoverageEstimator from "@/app/components/CoverageEstimator";
import PageHeader from "@/app/components/PageHeader";
import { roomRentPerDay } from "@/app/data/demo/policies";
import type { RawCoverageInput } from "@/app/lib/coverage";
import { getDemoPolicy } from "@/app/lib/products";

export const metadata: Metadata = {
  title: "Coverage estimator",
  description:
    "An illustrative calculator showing how sum insured, room rent limits, co-payment and deductibles change what a health policy pays. Not a quote.",
};

/**
 * `?policy=<id>` prefills the policy-side fields from a demo policy. An unknown
 * id is ignored rather than treated as an error: the estimator works perfectly
 * well without a prefill, so there is nothing for the user to fix.
 */
async function prefillFromPolicy(policyId: string | undefined) {
  if (!policyId) return null;

  const policy = await getDemoPolicy(policyId);
  if (!policy) return null;

  const roomLimit = roomRentPerDay(policy);

  const values: Partial<RawCoverageInput> = {
    sumInsured: String(policy.sumInsured),
    deductible: policy.deductible > 0 ? String(policy.deductible) : "",
    coPaymentPercent:
      policy.coPaymentPercent > 0 ? String(policy.coPaymentPercent) : "",
    roomRentLimitPerNight: roomLimit === null ? "" : String(roomLimit),
  };

  const note =
    `Prefilled from ${policy.name}, an invented teaching example — not a real product. ` +
    (roomLimit === null
      ? "That policy sets no rupee room limit, so the room field is blank."
      : "Change any figure to match your own policy.");

  return { values, note };
}

export default async function CoverageEstimatorPage(
  props: PageProps<"/coverage-estimator">,
) {
  const params = await props.searchParams;
  const policyId = Array.isArray(params.policy)
    ? params.policy[0]
    : params.policy;

  const prefill = await prefillFromPolicy(policyId);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="Illustrative only"
        title="Coverage estimator"
        intro={
          <p>
            A hospital bill is rarely paid in full. This works through the four
            things that reduce a claim — the room rent limit, the deductible,
            the co-payment and the sum insured — so you can see where the money
            goes before you are standing at a billing counter.
          </p>
        }
      />

      <Callout
        tone="caution"
        title="This is an estimate, never a payout"
        className="mt-8 max-w-3xl"
      >
        <p>
          This calculator does not know your policy. What an insurer actually
          pays depends on the exact policy wording, exclusions, sub-limits on
          specific procedures, waiting periods, non-medical items on the bill,
          and the insurer&apos;s own assessment of the claim. Any of those can
          change the outcome substantially.
        </p>

        <p>
          Treat the number below as a way to understand the mechanics — not as a
          promise, a quote, or an approval.
        </p>
      </Callout>

      {/*
        Keyed on the policy so navigating between two prefills replaces the form
        state rather than leaving the previous policy figures in the inputs.
      */}
      <CoverageEstimator
        key={policyId ?? "blank"}
        initialValues={prefill?.values}
        prefillNote={prefill?.note}
      />

      <section
        aria-labelledby="order-heading"
        className="mt-16 max-w-3xl rounded-md border border-slate-200 bg-slate-50 p-5 sm:p-6"
      >
        <h2 id="order-heading" className="font-semibold text-slate-900">
          The order used here
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          The bill has the room rent limit applied first, then the deductible,
          then the co-payment, and the result is capped at the sum insured. Most
          Indian health policies work in roughly this order, but yours may
          differ — and the order changes the final figure.
        </p>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Where a room costs more per night than the policy allows, many
          policies also reduce other treatment charges in the same proportion.
          That is included here, because it is the step that most often
          surprises people.
        </p>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/understand-policy"
            className="focus-ring rounded font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
          >
            What these terms mean
          </Link>

          <Link
            href="/demo-policies"
            className="focus-ring rounded font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
          >
            Try it with a teaching example
          </Link>
        </div>
      </section>
    </div>
  );
}
