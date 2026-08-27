import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/app/components/Button";
import Callout from "@/app/components/Callout";
import PageHeader from "@/app/components/PageHeader";
import { GLOSSARY } from "@/app/data/glossary";

export const metadata: Metadata = {
  title: "Understand my policy",
  description:
    "Sum insured, room rent limits, co-payment, deductibles, waiting periods, exclusions and sub-limits explained in plain English, with examples.",
};

export default function UnderstandPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <PageHeader
        title="Understand my policy"
        intro={
          <p>
            Policy documents are long, and the parts that decide what you get
            paid are usually a handful of numbers buried in them. Here is what
            each one means, why it matters, and what to look for in your own
            document.
          </p>
        }
      />

      {/*
        The upload panel is inert on purpose. It sits at the top because that is
        where the real feature will go, so introducing it later is a swap rather
        than a redesign.
      */}
      <section
        aria-labelledby="upload-heading"
        className="mt-10 rounded-md border-2 border-dashed border-slate-300 p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h2 id="upload-heading" className="font-semibold text-slate-900">
            Upload your policy document
          </h2>

          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
            Not available yet
          </span>
        </div>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
          The plan is to let you upload your own policy PDF and get a plain
          English summary of the same terms explained below — your actual sum
          insured, your room rent limit, your waiting periods — read out of your
          document rather than looked up in a table.
        </p>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
          None of that is built. There is no upload, no document analysis and no
          AI reading anything here today. When it does exist, this page will say
          exactly what happens to your document and for how long it is kept.
        </p>

        <Button type="button" disabled className="mt-5">
          Upload a policy — not available yet
        </Button>
      </section>

      <section aria-labelledby="terms-heading" className="mt-16">
        <h2
          id="terms-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          The terms that decide what you get paid
        </h2>

        <p className="mt-3 leading-relaxed text-slate-600">
          You can read these in order, or jump to whichever term is confusing
          you right now.
        </p>

        <nav aria-label="Terms" className="mt-5">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {GLOSSARY.map((entry) => (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  className="focus-ring rounded text-sm text-teal-800 underline underline-offset-4 hover:text-teal-900"
                >
                  {entry.term}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 space-y-10">
          {GLOSSARY.map((entry) => (
            <article key={entry.id} id={entry.id} className="scroll-mt-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {entry.term}
              </h3>

              <p className="mt-2 leading-relaxed text-slate-700">
                {entry.plainEnglish}
              </p>

              <dl className="mt-4 space-y-3 border-l-2 border-slate-200 pl-4">
                <div>
                  <dt className="text-sm font-medium text-slate-900">
                    Why it matters
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                    {entry.whyItMatters}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-slate-900">
                    For example
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                    {entry.example}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <Callout
        tone="caution"
        title="Your policy wording is what counts"
        className="mt-16"
      >
        <p>
          These explanations describe how the terms are generally used in India.
          Individual policies define them differently, and the definition
          printed in your own document is the one that applies to your claim.
          This page is not insurance advice.
        </p>
      </Callout>

      <section className="mt-12 rounded-md border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">Next steps</h2>

        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href="/coverage-estimator"
              className="focus-ring rounded font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
            >
              See how these numbers change a real bill
            </Link>
          </li>
          <li>
            <Link
              href="/demo-policies"
              className="focus-ring rounded font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
            >
              Read worked examples written in this structure
            </Link>
          </li>
          <li>
            <Link
              href="/claims"
              className="focus-ring rounded font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
            >
              Find out how to actually make a claim
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
