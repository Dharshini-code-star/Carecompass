import type { Metadata } from "next";
import Link from "next/link";

import Callout from "@/app/components/Callout";
import PageHeader from "@/app/components/PageHeader";
import {
  CLAIM_ROUTES,
  COMMON_DOCUMENTS,
  COMMON_MISTAKES,
  THINGS_TO_VERIFY,
} from "@/app/data/claims";

export const metadata: Metadata = {
  title: "Claim help",
  description:
    "Step-by-step guidance on cashless and reimbursement health insurance claims: what to do before admission, during the stay, at discharge and afterwards.",
};

export default function ClaimsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <PageHeader
        title="Claim help"
        intro={
          <p>
            There are two ways a health insurance claim is settled in India.
            Which one applies decides what you have to do, and when. Both are
            explained below, step by step.
          </p>
        }
      />

      <section aria-labelledby="routes-heading" className="mt-10">
        <h2 id="routes-heading" className="sr-only">
          The two claim routes
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {CLAIM_ROUTES.map((route) => (
            <div
              key={route.id}
              className="surface rounded-xl p-5"
            >
              <h3 className="font-semibold text-ink-900">{route.name}</h3>

              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {route.summary}
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-ink-500">Money</dt>
                  <dd className="text-ink-800">{route.moneyFlow}</dd>
                </div>

                <div>
                  <dt className="text-ink-500">Used when</dt>
                  <dd className="text-ink-800">{route.bestFor}</dd>
                </div>
              </dl>

              <a
                href={`#${route.id}`}
                className="focus-ring mt-4 inline-block rounded text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
              >
                Steps for a {route.name.toLowerCase()}
              </a>
            </div>
          ))}
        </div>
      </section>

      {CLAIM_ROUTES.map((route) => (
        <section
          key={route.id}
          id={route.id}
          aria-labelledby={`${route.id}-heading`}
          className="mt-16 scroll-mt-6"
        >
          <h2
            id={`${route.id}-heading`}
            className="text-2xl font-semibold tracking-tight text-ink-900"
          >
            {route.name}, step by step
          </h2>

          <p className="mt-3 leading-relaxed text-ink-600">{route.summary}</p>

          <div className="mt-8 space-y-8">
            {route.stages.map((stage) => (
              <div key={stage.stage}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
                  {stage.stage}
                </h3>

                <ol className="mt-3 space-y-4">
                  {stage.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-300 text-xs font-medium text-ink-600"
                      >
                        {index + 1}
                      </span>

                      <div>
                        <p className="font-medium text-ink-900">
                          {step.title}
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-ink-600">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section aria-labelledby="documents-heading" className="mt-16">
        <h2
          id="documents-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          Documents commonly needed
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Insurers differ, and yours may ask for more or fewer. Collect these
          while you are still at the hospital — going back for them afterwards
          is much harder.
        </p>

        <ul className="mt-5 surface divide-y divide-ink-200 overflow-hidden rounded-xl">
          {COMMON_DOCUMENTS.map((document) => (
            <li key={document} className="px-4 py-3 text-ink-700 sm:px-5">
              {document}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="verify-heading" className="mt-16">
        <h2
          id="verify-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          What to check before you commit
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Most claim problems are decided before treatment starts, not after.
          These are worth confirming with the insurer directly.
        </p>

        <ul className="mt-5 space-y-2">
          {THINGS_TO_VERIFY.map((item) => (
            <li
              key={item}
              className="surface rounded-xl px-4 py-3 text-ink-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mistakes-heading" className="mt-16">
        <h2
          id="mistakes-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          Common mistakes
        </h2>

        <dl className="mt-5 space-y-5">
          {COMMON_MISTAKES.map((item) => (
            <div key={item.mistake}>
              <dt className="font-medium text-ink-900">{item.mistake}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-600">
                {item.why}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Callout
        tone="caution"
        title="Your insurer's process is the one that applies"
        className="mt-16"
      >
        <p>
          This is general guidance on how health insurance claims are usually
          handled in India. Forms, deadlines and document lists vary between
          insurers and between policies, and following these steps does not mean
          a claim will be approved.
        </p>

        <p>
          For anything that affects your own claim, confirm it with your insurer
          or the hospital&apos;s insurance desk. CareCompass cannot make, submit
          or influence a claim.
        </p>
      </Callout>

      <section className="mt-12 surface rounded-xl bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-ink-900">Related</h2>

        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href="/understand-policy"
              className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              What room rent limits and co-payments actually mean
            </Link>
          </li>
          <li>
            <Link
              href="/coverage-estimator"
              className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              Estimate how much of a bill a policy might pay
            </Link>
          </li>
          <li>
            <Link
              href="/hospitals"
              className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              Browse demo hospitals in Chennai
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
