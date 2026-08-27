import type { Metadata } from "next";
import Link from "next/link";

import DemoDataNotice from "@/app/components/DemoDataNotice";
import PageHeader from "@/app/components/PageHeader";
import PolicyListItem from "@/app/components/PolicyListItem";
import { listDemoPolicies } from "@/app/lib/products";

export const metadata: Metadata = {
  title: "Teaching examples (demo policies)",
  description:
    "Invented health insurance policies used to explain how a policy is structured. Not real products.",
};

export default async function DemoPoliciesPage() {
  const policies = await listDemoPolicies();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="Demo data"
        title="Teaching examples"
        intro={
          <p>
            {policies.length} invented policies, written to show how the parts of
            a health policy fit together. Nothing here is a real product and none
            of it can be bought.
          </p>
        }
      />

      <DemoDataNotice subject="policies" className="mt-8" />

      <section aria-labelledby="policies-heading" className="mt-10">
        <h2 id="policies-heading" className="sr-only">
          Demo policies
        </h2>

        <ul className="divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200">
          {policies.map((policy) => (
            <PolicyListItem key={policy.id} policy={policy} />
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-md border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">Looking for real products?</h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Real, IRDAI-listed products are shown with their UIN and a link to the
          actual policy wording.
        </p>

        <Link
          href="/insurance"
          className="focus-ring mt-4 inline-block rounded text-sm font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
        >
          Explore real insurance products
        </Link>
      </section>
    </div>
  );
}
