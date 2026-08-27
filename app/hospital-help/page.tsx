import type { Metadata } from "next";
import Link from "next/link";

import Callout from "@/app/components/Callout";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "I'm at the hospital — help me",
  description:
    "Quick guidance for people already at a hospital. This feature is not built yet; the pages that do exist today are listed here.",
};

/** What this page is intended to become. None of it is built. */
const PLANNED = [
  {
    title: "Work out which claim route you are on",
    detail:
      "A few questions to establish whether cashless is realistic here, or whether this will be a reimbursement claim.",
  },
  {
    title: "Tell you what to ask the insurance desk",
    detail:
      "The specific questions that decide the outcome, in the order worth asking them.",
  },
  {
    title: "Show what to check before accepting a room",
    detail:
      "Your room rent limit against what is being offered, and what a room upgrade actually costs across the whole bill.",
  },
  {
    title: "List the documents to collect before discharge",
    detail:
      "What to ask the hospital for while you are still there, rather than weeks later.",
  },
];

/** Pages that exist and are useful right now. */
const AVAILABLE_NOW = [
  {
    href: "/claims",
    title: "Claim help",
    detail:
      "The cashless and reimbursement processes, what to ask, what to collect, and the mistakes that cost people claims.",
  },
  {
    href: "/understand-policy",
    title: "Understand my policy",
    detail:
      "What room rent limits, co-payment, deductibles and waiting periods mean, with examples.",
  },
  {
    href: "/coverage-estimator",
    title: "Coverage estimator",
    detail:
      "A rough sense of how much of a bill a policy might cover, and which term is reducing it.",
  },
];

export default function HospitalHelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <PageHeader
        title="I'm at the hospital — help me"
        intro={
          <p>
            The plan is a short, guided path for someone standing at an
            admission or billing desk who needs to work out what their insurance
            covers. It is not built yet.
          </p>
        }
      />

      <Callout
        tone="caution"
        title="This feature is not active"
        className="mt-8"
      >
        <p>
          This page cannot check your policy, contact a hospital or insurer,
          arrange cashless treatment, or help with a claim. Nothing on it is
          connected to anything.
        </p>

        <p>
          InsureGuide is not an emergency service and cannot give medical help.
          In a medical emergency, speak to the hospital staff in front of you.
        </p>
      </Callout>

      <section aria-labelledby="now-heading" className="mt-12">
        <h2
          id="now-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          What can help you today
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          These pages exist now, need no account, and cover most of what the
          guided version would tell you.
        </p>

        <ul className="mt-5 surface divide-y divide-ink-200 overflow-hidden rounded-xl">
          {AVAILABLE_NOW.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="focus-ring flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-ink-50"
              >
                <span>
                  <span className="block font-semibold text-ink-900">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-600">
                    {item.detail}
                  </span>
                </span>

                <span aria-hidden="true" className="mt-0.5 shrink-0 text-ink-400">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="planned-heading" className="mt-16">
        <h2
          id="planned-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          What this page is meant to become
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          None of the following works yet. It is written down so you can see
          what is coming rather than being shown a blank page.
        </p>

        <dl className="mt-5 space-y-5">
          {PLANNED.map((item) => (
            <div key={item.title}>
              <dt className="font-medium text-ink-900">{item.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-600">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Callout tone="info" title="It will not ask you to sign up" className="mt-12">
        <p>
          Someone at a hospital desk should not have to create an account to
          find out what their own policy covers. When this is built, the
          guidance will be readable without signing in.
        </p>
      </Callout>
    </div>
  );
}
