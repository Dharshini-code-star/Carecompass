import Link from "next/link";

import { CITED_SOURCE_IDS } from "@/app/data/sources";
import { TOTAL_REAL_HOSPITALS } from "@/app/lib/hospitals";
import { TOTAL_REAL_PRODUCTS } from "@/app/lib/products";

const actions = [
  {
    title: "Find a hospital",
    description:
      "Real Chennai hospitals from the Tamil Nadu government list, each showing its source and what has actually been checked.",
    href: "/hospitals",
    featured: true,
  },
  {
    title: "Check a facility",
    description:
      "Need an ICU, a blood bank, a CT scan? See what the data shows at your hospital, and which others appear to have it.",
    href: "/facility-check",
  },
  {
    title: "Explore insurance",
    description:
      "Real IRDAI-listed products, with their UIN and the actual policy wording.",
    href: "/insurance",
  },
  {
    title: "Understand my policy",
    description:
      "What sum insured, room rent limits and waiting periods actually mean.",
    href: "/understand-policy",
  },
  {
    title: "Estimate your cover",
    description:
      "Work out roughly how much of a hospital bill a policy might pay, and why.",
    href: "/coverage-estimator",
  },
  {
    title: "Claim help",
    description:
      "Cashless and reimbursement, step by step — before, during and after.",
    href: "/claims",
  },
];

/** Real counts, read from the datasets. Nothing here is a marketing number. */
const stats = [
  {
    value: TOTAL_REAL_HOSPITALS,
    label: "Chennai hospitals, government-sourced",
  },
  { value: TOTAL_REAL_PRODUCTS, label: "IRDAI-listed products, with UINs" },
  { value: CITED_SOURCE_IDS.length, label: "official sources cited" },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <div>
      <section className="hero-wash border-b border-ink-200/70">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          <div className="max-w-3xl">
            <p className="label-eyebrow inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1.5 text-brand-700 shadow-xs">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-brand-500"
              />
              Chennai &amp; Tamil Nadu
            </p>

            <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[3.75rem]">
              Health insurance,
              <br />
              <span className="text-brand-700">made understandable.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-[1.65] text-ink-600 sm:text-xl">
              Whether you&apos;re looking for insurance, trying to make sense of
              the policy you already have, or standing at a hospital admission
              desk — InsureGuide explains what your cover means and what you can
              do next, in plain English.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/hospitals"
                className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand-700 hover:shadow-md active:translate-y-px"
              >
                Find a hospital
                <ArrowIcon />
              </Link>

              <Link
                href="/trust"
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg border border-ink-300 bg-white px-5 text-sm font-semibold text-ink-800 shadow-xs transition-all duration-150 hover:border-ink-400 hover:shadow-sm active:translate-y-px"
              >
                How we source data
              </Link>
            </div>
          </div>

          <dl className="mt-14 grid max-w-3xl gap-x-8 gap-y-6 border-t border-ink-200/80 pt-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span
                    className="block text-3xl font-semibold tracking-tight text-ink-900"
                    data-numeric
                  >
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-sm leading-snug text-ink-500">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="actions-heading">
          <h2
            id="actions-heading"
            className="label-eyebrow flex items-center gap-2 text-ink-500"
          >
            <span aria-hidden="true" className="h-px w-6 bg-ink-300" />
            What do you want to do?
          </h2>

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {actions.map((action) => (
              <li
                key={action.href}
                className={action.featured ? "md:col-span-2" : undefined}
              >
                <Link
                  href={action.href}
                  className={`focus-ring surface-interactive group flex h-full flex-col rounded-xl p-6 ${
                    action.featured ? "sm:p-8" : ""
                  }`}
                >
                  <span
                    className={`font-semibold text-ink-900 ${
                      action.featured ? "text-xl sm:text-2xl" : "text-lg"
                    }`}
                  >
                    {action.title}
                  </span>

                  <span
                    className={`mt-2 block leading-relaxed text-ink-600 ${
                      action.featured ? "max-w-xl text-base" : "text-sm"
                    }`}
                  >
                    {action.description}
                  </span>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                    Open
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="urgent-heading" className="mt-6">
          <div className="rounded-xl border border-caution-200 bg-caution-50 p-6 shadow-xs sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
              <h2
                id="urgent-heading"
                className="text-lg font-semibold text-caution-800"
              >
                I&apos;m at the hospital — help me
              </h2>

              <span className="label-eyebrow shrink-0 rounded-full border border-caution-300 bg-caution-100 px-2.5 py-1 text-caution-800">
                Coming soon
              </span>
            </div>

            <p className="mt-3 max-w-2xl leading-relaxed text-caution-800/85">
              Quick guidance for people already at a hospital who need to work
              out what their insurance covers. This is not built yet, and it
              will never require an account.
            </p>

            <Link
              href="/hospital-help"
              className="focus-ring group mt-5 inline-flex items-center gap-2 rounded text-sm font-semibold text-caution-800 underline decoration-caution-300 underline-offset-4 hover:decoration-caution-600"
            >
              See what is planned
              <ArrowIcon />
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="trust-heading"
          className="mt-20 grid gap-10 border-t border-ink-200 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]"
        >
          <div>
            <h2
              id="trust-heading"
              className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl"
            >
              Honest about what we know
            </h2>

            <p className="mt-5 max-w-2xl leading-[1.7] text-ink-600">
              Insurance documents are full of terms, exclusions and sub-limits
              that are hardest to interpret exactly when they matter most.
              InsureGuide exists to turn that into something you can read
              quickly and act on.
            </p>

            <p className="mt-4 max-w-2xl leading-[1.7] text-ink-600">
              That only works if you can tell what has actually been checked.
              Every hospital and product here carries the source it came from
              and the date it was last verified — and where something has not
              been confirmed, it says{" "}
              <strong className="font-semibold text-ink-800">
                Not verified
              </strong>{" "}
              instead of guessing.
            </p>

            <Link
              href="/trust"
              className="focus-ring group mt-6 inline-flex items-center gap-2 rounded font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600"
            >
              How we handle data
              <ArrowIcon />
            </Link>
          </div>

          <div className="surface rounded-xl p-6">
            <p className="label-eyebrow text-ink-500">What we never say</p>

            <ul className="mt-4 space-y-3.5">
              {[
                "That a hospital accepts your insurer",
                "That treatment will be cashless",
                "That a claim will be approved",
              ].map((claim) => (
                <li key={claim} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      className="h-2.5 w-2.5"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>

                  <span className="text-sm leading-relaxed text-ink-700">
                    {claim}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-ink-200 pt-4 text-sm leading-relaxed text-ink-500">
              Those depend on your policy and your insurer. No third party can
              tell you them reliably — so we point you at the people who can.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
