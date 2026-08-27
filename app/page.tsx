import Link from "next/link";

const actions = [
  {
    title: "Find a hospital",
    description:
      "Real Chennai hospitals from the Tamil Nadu government list, with sources.",
    href: "/hospitals",
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
      "Learn what sum insured, room rent limits and waiting periods actually mean.",
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
      "Follow the cashless and reimbursement claim processes step by step.",
    href: "/claims",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-teal-800">
          Chennai &amp; Tamil Nadu
        </p>

        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Health insurance, made understandable.
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Whether you&apos;re looking for insurance, trying to make sense of the
          policy you already have, or standing at a hospital admission desk —
          InsureGuide explains what your cover means and what you can do next,
          in plain English.
        </p>
      </section>

      <section aria-labelledby="actions-heading" className="mt-12 max-w-3xl">
        <h2
          id="actions-heading"
          className="text-sm font-semibold uppercase tracking-wider text-slate-500"
        >
          What do you want to do?
        </h2>

        <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200">
          {actions.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="focus-ring flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
              >
                <span>
                  <span className="block font-semibold text-slate-900">
                    {action.title}
                  </span>

                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {action.description}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-slate-400"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="urgent-heading" className="mt-8 max-w-3xl">
        <div className="rounded-md border border-amber-300 bg-amber-50 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <h2 id="urgent-heading" className="font-semibold text-amber-900">
              I&apos;m at the hospital — help me
            </h2>

            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
              Coming soon
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-amber-900/90">
            Quick guidance for people who are already at a hospital and need to
            work out what their insurance covers. This is not built yet, and it
            will never require an account.
          </p>

          <Link
            href="/hospital-help"
            className="focus-ring mt-4 inline-block rounded text-sm font-medium text-amber-900 underline underline-offset-4 hover:text-amber-950"
          >
            See what is planned
          </Link>
        </div>
      </section>

      <section aria-labelledby="trust-heading" className="mt-16 max-w-3xl">
        <h2
          id="trust-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Honest about what we know
        </h2>

        <p className="mt-4 leading-relaxed text-slate-600">
          Insurance documents are full of terms, exclusions and sub-limits that
          are hardest to interpret exactly when they matter most. InsureGuide
          exists to turn that into something you can read quickly and act on.
        </p>

        <p className="mt-4 leading-relaxed text-slate-600">
          That only works if you can tell what has actually been checked. Every
          hospital and product here carries the source it came from and the date
          it was last verified — and where something has not been confirmed, it
          says <strong>Not verified</strong> instead of guessing.
        </p>

        <p className="mt-4 leading-relaxed text-slate-600">
          We never claim a hospital accepts an insurer, that treatment will be
          cashless, or that a claim will be approved. Those depend on your policy
          and your insurer, and no third party can tell you them reliably.
        </p>

        <Link
          href="/trust"
          className="focus-ring mt-5 inline-block rounded font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
        >
          How we handle data
        </Link>
      </section>
    </div>
  );
}
