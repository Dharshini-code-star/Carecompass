import Image from "next/image";
import Link from "next/link";

import { CITED_SOURCE_IDS } from "@/app/data/sources";
import { TOTAL_REAL_HOSPITALS } from "@/app/lib/hospitals";

const features = [
  {
    number: "01",
    title: "Find Hospitals",
    description: "Search hospitals by location and care needs.",
    href: "/hospitals",
  },
  {
    number: "02",
    title: "Check Insurance",
    description: "Explore available insurance and network information.",
    href: "/insurance",
  },
  {
    number: "03",
    title: "Ask AI",
    description: "Get answers grounded in available evidence.",
    href: "/ask",
  },
  {
    number: "04",
    title: "Compare",
    description: "Compare hospitals using verified information.",
    href: "/compare",
  },
];

const trustPoints = [
  "Verified information is clearly labelled.",
  "Unknown stays unknown until a source confirms it.",
  "Every record links back to its evidence.",
];

export default function Home() {
  return (
    <div>
      <section className="relative isolate min-h-[28rem] overflow-hidden border-b border-ink-200 sm:min-h-[32rem]">
        <Image
          src="/carecompass-hospital-navigation.png"
          alt="A patient navigating a modern hospital reception"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_center]"
        />
        <div className="absolute inset-0 bg-ink-900/55" />
        <div className="relative mx-auto flex min-h-[28rem] max-w-6xl flex-col justify-end px-5 py-10 sm:min-h-[32rem] sm:px-8 sm:py-14">
          <div className="max-w-2xl text-white">
            <p className="label-eyebrow text-brand-100">Healthcare navigation</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] text-white sm:text-6xl">
              CareCompass
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Navigate hospitals, insurance &amp; care with confidence.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/hospitals"
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50"
              >
                Find a Hospital
              </Link>
              <Link
                href="/ask"
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg border border-white/60 bg-ink-900/20 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Ask CareCompass
              </Link>
            </div>
          </div>
          <dl className="mt-10 grid max-w-2xl gap-5 border-t border-white/35 pt-5 text-white sm:grid-cols-3">
            <div>
              <dt className="sr-only">Hospital records</dt>
              <dd className="text-2xl font-semibold" data-numeric>{TOTAL_REAL_HOSPITALS}</dd>
              <span className="mt-1 block text-sm text-white/80">hospital records</span>
            </div>
            <div>
              <dt className="sr-only">Cited sources</dt>
              <dd className="text-2xl font-semibold" data-numeric>{CITED_SOURCE_IDS.length}</dd>
              <span className="mt-1 block text-sm text-white/80">cited sources</span>
            </div>
            <div>
              <dt className="sr-only">Evidence states</dt>
              <dd className="text-2xl font-semibold">3</dd>
              <span className="mt-1 block text-sm text-white/80">clear evidence states</span>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-eyebrow text-brand-700">Explore care</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Make the next healthcare decision clearer.
            </h2>
          </div>
          <Link
            href="/trust"
            className="focus-ring rounded text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            How evidence works
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <li key={feature.href}>
              <Link
                href={feature.href}
                className="focus-ring surface-interactive flex min-h-44 flex-col rounded-lg p-5 sm:p-6"
              >
                <span className="label-eyebrow text-brand-700">{feature.number}</span>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {feature.description}
                </p>
                <span className="mt-auto pt-5 text-sm font-semibold text-brand-700">
                  Open
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-ink-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <div>
            <p className="label-eyebrow text-brand-700">Evidence first</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Know what is confirmed before you act.
            </h2>
          </div>
          <ul className="space-y-4">
            {trustPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-800">
                  +
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8 sm:py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="label-eyebrow text-brand-200">Ask CareCompass</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Start with a clear question.
            </h2>
          </div>
          <Link
            href="/ask"
            className="focus-ring inline-flex min-h-11 items-center justify-center self-start rounded-lg bg-white px-4 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 md:self-auto"
          >
            Ask CareCompass
          </Link>
        </div>
      </section>
    </div>
  );
}
