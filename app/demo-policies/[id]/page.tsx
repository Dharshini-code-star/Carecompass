import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Callout from "@/app/components/Callout";
import DemoDataNotice from "@/app/components/DemoDataNotice";
import DetailList from "@/app/components/DetailList";
import PageHeader from "@/app/components/PageHeader";
import ProvenanceNote from "@/app/components/ProvenanceNote";
import { insurerName } from "@/app/data/demo/insurers";
import { describeRoomRent } from "@/app/data/demo/policies";
import { getGlossaryTerm } from "@/app/data/glossary";
import { formatInr } from "@/app/lib/format";
import { getDemoPolicy, listDemoPolicyIds } from "@/app/lib/products";

export async function generateStaticParams() {
  const ids = await listDemoPolicyIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata(
  props: PageProps<"/demo-policies/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const policy = await getDemoPolicy(id);

  if (!policy) return { title: "Demo policy not found" };

  return {
    title: `${policy.name} (demo)`,
    description:
      "An invented teaching example showing how a health policy is structured. Not a real product.",
  };
}

/** Definitions live in the glossary so the wording is identical everywhere. */
function plainEnglish(termId: string): string | undefined {
  return getGlossaryTerm(termId)?.plainEnglish;
}

export default async function DemoPolicyPage(
  props: PageProps<"/demo-policies/[id]">,
) {
  const { id } = await props.params;
  const policy = await getDemoPolicy(id);

  if (!policy) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/demo-policies"
        className="focus-ring rounded text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← All teaching examples
      </Link>

      <div className="mt-6">
        <PageHeader
          eyebrow="Demo data — invented"
          title={policy.name}
          intro={
            <p>
              {insurerName(policy.insurerId)} · {policy.type} ·{" "}
              {policy.claimType.toLowerCase()}
            </p>
          }
        />
      </div>

      <div className="mt-5 surface rounded-xl bg-white p-4">
        <ProvenanceNote provenance={policy.provenance} />
      </div>

      <DemoDataNotice subject="figures" className="mt-8" />

      <section aria-labelledby="numbers-heading" className="mt-12">
        <h2
          id="numbers-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          The numbers that decide what gets paid
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          These four settings do most of the work in any health policy. Read them
          together — a large sum insured can still pay out little if the room
          rent limit is low.
        </p>

        <div className="mt-5">
          <DetailList
            items={[
              {
                label: "Sum insured",
                value: formatInr(policy.sumInsured),
                hint: plainEnglish("sum-insured"),
              },
              {
                label: "Room rent limit",
                value: describeRoomRent(policy),
                hint: plainEnglish("room-rent-limit"),
              },
              {
                label: "Co-payment",
                value:
                  policy.coPaymentPercent > 0
                    ? `${policy.coPaymentPercent}% of every approved claim`
                    : "None",
                hint: plainEnglish("co-payment"),
              },
              {
                label: "Deductible",
                value:
                  policy.deductible > 0
                    ? `${formatInr(policy.deductible)} before the policy pays`
                    : "None",
                hint: plainEnglish("deductible"),
              },
            ]}
          />
        </div>

        <Link
          href={`/coverage-estimator?policy=${policy.id}`}
          className="focus-ring mt-5 inline-block rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
        >
          Work these figures through the coverage estimator
        </Link>
      </section>

      <section aria-labelledby="waiting-heading" className="mt-12">
        <h2
          id="waiting-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          Waiting periods
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          {plainEnglish("waiting-period")} A claim made before the relevant
          waiting period has finished is usually declined, even though the policy
          itself is perfectly valid.
        </p>

        <dl className="mt-5 surface divide-y divide-ink-200 overflow-hidden rounded-xl">
          {policy.waitingPeriods.map((period) => (
            <div
              key={period.label}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5"
            >
              <dt className="text-ink-700">{period.label}</dt>
              <dd className="font-medium text-ink-900">{period.duration}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="exclusions-heading" className="mt-12">
        <h2
          id="exclusions-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          What this example does not pay for
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          {plainEnglish("exclusions")} No waiting period changes an exclusion.
        </p>

        <ul className="mt-5 space-y-2">
          {policy.exclusions.map((exclusion) => (
            <li
              key={exclusion}
              className="surface rounded-xl px-4 py-3 text-ink-700"
            >
              {exclusion}
            </li>
          ))}
        </ul>
      </section>

      <Callout
        tone="caution"
        title="This is not a product you can buy"
        className="mt-12"
      >
        <p>
          {policy.name} does not exist, and neither does{" "}
          {insurerName(policy.insurerId)}. The figures were chosen to show how
          real policies are structured, not to describe or recommend any real
          product.
        </p>

        <p>
          <Link
            href="/insurance"
            className="focus-ring rounded font-medium underline underline-offset-4"
          >
            Real products listed by IRDAI
          </Link>
        </p>
      </Callout>

      <Link
        href="/demo-policies"
        className="focus-ring mt-10 inline-block rounded text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← All teaching examples
      </Link>
    </div>
  );
}
