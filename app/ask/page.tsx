import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Ask CareCompass",
  description: "Evidence-led healthcare navigation from CareCompass.",
};

const QUESTIONS = [
  { label: "Find hospitals near me", href: "/hospitals" },
  { label: "Check insurance information", href: "/insurance" },
  { label: "Compare these hospitals", href: "/compare" },
  { label: "What facilities are verified?", href: "/facility-check" },
  { label: "Explain this insurance term", href: "/understand-policy" },
  { label: "What should I verify before admission?", href: "/claims" },
];

const RESPONSE_SECTIONS = [
  ["Answer", "Clear next step"],
  ["Evidence", "Only sourced information"],
  ["Sources", "Open the original record"],
  ["Verification", "Verified, partial or unknown"],
];

export default function AskPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow="CareCompass AI"
        title="Ask CareCompass"
        intro={<p>Your AI assistant for healthcare navigation.</p>}
      />

      <section className="surface mt-8 rounded-lg bg-white p-5 sm:p-6">
        <label htmlFor="care-question" className="text-sm font-semibold text-ink-900">
          Start with a question
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="care-question"
            type="text"
            placeholder="Search a hospital or choose a prompt below"
            className="min-h-11 flex-1 rounded-lg border border-ink-300 bg-white px-3 text-sm text-ink-800 outline-none placeholder:text-ink-400 focus:border-brand-600"
          />
          <Link
            href="/hospitals"
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Search hospitals
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {QUESTIONS.map((question) => (
            <Link
              key={question.label}
              href={question.href}
              className="focus-ring rounded-full border border-ink-300 bg-ink-50 px-3 py-2 text-sm text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
            >
              {question.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <p className="label-eyebrow text-brand-700">Evidence-led responses</p>
        <h2 className="mt-2 text-xl font-semibold">Built for quick decisions.</h2>
        <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-ink-200 bg-ink-200 sm:grid-cols-2">
          {RESPONSE_SECTIONS.map(([title, detail]) => (
            <div key={title} className="bg-white p-5">
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-ink-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-ink-600">
        CareCompass does not invent hospital facilities, network status or insurance coverage. Unknown information stays unknown.
      </p>
    </div>
  );
}

