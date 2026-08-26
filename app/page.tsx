const userPaths = [
  {
    title: "I need insurance",
    description:
      "Explore and compare health insurance policies in simple terms.",
    action: "Explore Insurance",
    href: "#features",
  },
  {
    title: "I already have insurance",
    description:
      "Understand your coverage, hospitals, policy conditions, and claims.",
    action: "Understand My Policy",
    href: "#features",
  },
];

const features = [
  {
    title: "Find a Hospital",
    description: "Find hospitals and check insurance network information.",
  },
  {
    title: "Explore Insurance",
    description:
      "Browse health insurance policies and understand important terms.",
  },
  {
    title: "Compare Policies",
    description: "Compare coverage, limits and important conditions.",
  },
  {
    title: "Understand My Policy",
    description: "Upload your policy and get a simpler explanation.",
  },
  {
    title: "Estimate Coverage",
    description:
      "Get an illustrative estimate of potential medical expenses.",
  },
  {
    title: "Claim Help",
    description:
      "Understand cashless and reimbursement claim processes.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="#top"
            className="rounded text-lg font-semibold tracking-tight text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            InsureGuide
          </a>

          <nav
            aria-label="Primary"
            className="hidden gap-8 text-sm text-slate-600 sm:flex"
          >
            <a
              href="#features"
              className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 hover:text-slate-900"
            >
              What we help with
            </a>

            <a
              href="#trust"
              className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 hover:text-slate-900"
            >
              Trust &amp; transparency
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24"
      >
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-teal-800">
            Healthcare &amp; insurance guidance
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Health insurance, made understandable.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Whether you&apos;re looking for insurance, trying to understand
            your existing policy, or already at the hospital — InsureGuide
            helps you understand what to do next.
          </p>
        </div>

        {/* Main user paths */}
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            What brings you here?
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {userPaths.map((path) => (
              <a
                key={path.title}
                href={path.href}
                className="group rounded-lg border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {path.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {path.description}
                </p>

                <span className="mt-5 inline-block text-sm font-medium text-teal-800 group-hover:text-teal-900">
                  {path.action} →
                </span>
              </a>
            ))}

            {/* Emergency path */}
            <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-6 md:col-span-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="text-xl leading-none"
                  >
                    🚨
                  </span>

                  <div>
                    <h3 className="font-semibold text-amber-900">
                      I&apos;m at the hospital — Help me
                    </h3>

                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-amber-800">
                      Get immediate guidance about insurance, hospital
                      coverage, cashless treatment, and what to do next.
                    </p>

                    <p className="mt-2 text-xs text-amber-700">
                      No account will be required for basic emergency
                      guidance.
                    </p>
                  </div>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section
        id="features"
        className="border-t border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              What can we help you with?
            </h2>

            <p className="mt-3 text-slate-600">
              Explore the tools InsureGuide is being built around.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-md border border-slate-200 bg-white p-6"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Insurance information shouldn&apos;t be confusing.
            </h2>

            <p className="mt-4 leading-relaxed text-slate-600">
              Insurance documents are often full of complicated terms,
              exclusions, sub-limits and conditions that are hard to interpret
              when it matters most. InsureGuide aims to turn that information
              into guidance that&apos;s actually easy to understand.
            </p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section
        id="trust"
        className="border-t border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Built around clarity and transparency
            </h2>

            <p className="mt-4 leading-relaxed text-slate-600">
              When insurance or hospital information is eventually shown, it
              will be presented with its source, its verification status, and
              when it was last checked or updated, wherever possible.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Live, verified insurance and hospital data is not implemented
              yet.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
            InsureGuide is an information and navigation tool. It does not
            guarantee insurance coverage, cashless treatment, claim approval,
            or reimbursement. Users should confirm coverage and claim
            requirements with their insurer or healthcare provider.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} InsureGuide. Chennai, Tamil Nadu,
            India.
          </p>
        </div>
      </footer>
    </main>
  );
}