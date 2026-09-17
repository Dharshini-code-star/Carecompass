import type { Metadata } from "next";
import Link from "next/link";

import Callout from "@/app/components/Callout";
import NotTheInsurerNotice from "@/app/components/NotTheInsurerNotice";
import PageHeader from "@/app/components/PageHeader";
import VerificationBadge from "@/app/components/VerificationBadge";
import {
  VERIFICATION_MEANINGS,
  type VerificationStatus,
} from "@/app/data/provenance";
import { CITED_SOURCE_IDS, getSource } from "@/app/data/sources";
import {
  HOSPITALS_WITH_CONFIRMED_EMERGENCY,
  HOSPITALS_WITH_OFFICIAL_WEBSITE,
  TOTAL_REAL_HOSPITALS,
} from "@/app/lib/hospitals";
import {
  PRODUCTS_MISSING_TYPE_LABEL,
  TOTAL_DEMO_POLICIES,
  TOTAL_REAL_INSURERS,
  TOTAL_REAL_PRODUCTS,
} from "@/app/lib/products";

export const metadata: Metadata = {
  title: "Where our data comes from",
  description:
    "Every record CareCompass shows, its source, verification state and any remaining unknowns.",
};

const STATUS_ORDER: VerificationStatus[] = [
  "verified",
  "source-provided",
  "not-verified",
  "demo",
];

const DATASETS = [
  {
    name: "Chennai hospitals",
    count: `${TOTAL_REAL_HOSPITALS} records`,
    status: "Real — from a government list",
    href: "/hospitals",
  },
  {
    name: "Insurance products",
    count: `${TOTAL_REAL_PRODUCTS} records from ${TOTAL_REAL_INSURERS} insurers`,
    status: "Real — from the regulator's database",
    href: "/insurance",
  },
  {
    name: "Teaching examples",
    count: `${TOTAL_DEMO_POLICIES} policies`,
    status: "Demo — invented, and labelled as such",
    href: "/demo-policies",
  },
];

/** Stated plainly rather than buried, because this is the honest part. */
const UNKNOWN_INFORMATION = [
  {
    what: "Whether any private insurer covers you at any hospital",
    why: "Network lists can differ by insurer and policy. Every private insurer remains Unknown until an official network list is verified.",
  },
  {
    what: "Which facilities a hospital has",
    why: "The CMCHIS list does not publish facilities. ICU, blood bank and CT information remain Unknown unless an official source confirms them.",
  },
  {
    what: "Distances between hospitals",
    why: "No coordinates are verified for any hospital, so the facility check reports distance as unknown rather than estimating it. Unknown distance is never treated as far, and such hospitals are never dropped from a radius search.",
  },
  {
    what: "Street addresses",
    why: `The CMCHIS list does not publish them, and we have not confirmed them from another official source. All ${TOTAL_REAL_HOSPITALS} hospital records leave the address empty.`,
  },
  {
    what: "Emergency departments",
    why: `Confirmed for ${HOSPITALS_WITH_CONFIRMED_EMERGENCY} of ${TOTAL_REAL_HOSPITALS} hospitals, from the hospital's own website. For the rest it is unknown — which never means there is no emergency department.`,
  },
  {
    what: "Official websites",
    why: `Confirmed for ${HOSPITALS_WITH_OFFICIAL_WEBSITE} of ${TOTAL_REAL_HOSPITALS} hospitals. We would rather leave a link out than send you to the wrong site.`,
  },
  {
    what: "What each policy actually covers",
    why: "Sum insured, room rent limits, waiting periods, co-payment and exclusions are not copied into this app at all. Each product links to the policy wording IRDAI holds for that UIN instead.",
  },
  {
    what: "IRDAI's product-type label on some records",
    why: `Not captured for ${PRODUCTS_MISSING_TYPE_LABEL} of ${TOTAL_REAL_PRODUCTS} products, so those show "Not recorded" rather than a guess.`,
  },
];

const RULES = [
  "A record is never marked verified because it looks plausible. Verified means someone checked it against an official source on a stated date.",
  "Where a fact cannot be confirmed, it is shown as Unknown. Missing information is never filled in with a guess.",
  "CareCompass never states that a hospital accepts an insurer, that treatment will be cashless, or that a claim will be approved.",
  "Product existence and hospital network status are stored as separate facts, so one can never be inferred from the other.",
  "Invented data is labelled DEMO DATA on every screen it appears on, and is kept in a separate part of the app from real records.",
  "Every real record carries the source it came from and the date it was last checked, and both travel with it wherever it is displayed.",
];

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <PageHeader
        title="Where our data comes from"
        intro={
          <p>
            Health insurance information is only useful if you can tell how much
            weight to put on it. This page says exactly what has been checked,
            what has not, and who published each thing.
          </p>
        }
      />

      <NotTheInsurerNotice className="mt-8" />

      <section aria-labelledby="datasets-heading" className="mt-12">
        <h2
          id="datasets-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          What is in the app
        </h2>

        <ul className="mt-5 surface divide-y divide-ink-200 overflow-hidden rounded-xl">
          {DATASETS.map((dataset) => (
            <li key={dataset.name} className="px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <Link
                  href={dataset.href}
                  className="focus-ring rounded font-semibold text-ink-900 underline underline-offset-4"
                >
                  {dataset.name}
                </Link>

                <span className="text-sm text-ink-600">{dataset.count}</span>
              </div>

              <p className="mt-1 text-sm text-ink-600">{dataset.status}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="labels-heading" className="mt-16">
        <h2
          id="labels-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          What the four labels mean
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Every record, and in places every individual field, carries one of
          these. They are stored with the record itself, so the same fact is
          never labelled one way in a list and another way on a detail page.
        </p>

        <dl className="mt-6 space-y-5">
          {STATUS_ORDER.map((status) => (
            <div key={status}>
              <dt>
                <VerificationBadge status={status} />
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-600">
                {VERIFICATION_MEANINGS[status]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="sources-heading" className="mt-16">
        <h2
          id="sources-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          The sources we cite
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          A source is only added here when it is authoritative for the kind of
          fact it is used for. Directories, review sites, aggregators and blogs
          are not used for factual records.
        </p>

        <ul className="mt-6 space-y-4">
          {CITED_SOURCE_IDS.map((id) => {
            const source = getSource(id);

            return (
              <li
                key={id}
                className="surface rounded-xl p-4 sm:p-5"
              >
                <h3 className="font-semibold text-ink-900">{source.name}</h3>

                <p className="mt-1 text-sm text-ink-600">{source.publisher}</p>

                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  <span className="font-medium text-ink-800">
                    Used for:{" "}
                  </span>
                  {source.authoritativeFor}
                </p>

                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-3 inline-block break-all rounded text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
                  >
                    {source.url}
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="unverified-heading" className="mt-16">
        <h2
          id="unverified-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          What is still unknown
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          This is the part most products leave out. Everything below is a known
          gap, stated on purpose.
        </p>

        <dl className="mt-6 space-y-5">
          {UNKNOWN_INFORMATION.map((item) => (
            <div key={item.what}>
              <dt className="font-medium text-ink-900">{item.what}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-600">
                {item.why}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="rules-heading" className="mt-16">
        <h2
          id="rules-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          Rules we hold ourselves to
        </h2>

        <ul className="mt-5 space-y-3">
          {RULES.map((rule) => (
            <li
              key={rule}
              className="surface rounded-xl px-4 py-3 leading-relaxed text-ink-700"
            >
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="privacy-heading" className="mt-16">
        <h2
          id="privacy-heading"
          className="text-2xl font-semibold tracking-tight text-ink-900"
        >
          What happens to what you type
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Nothing. There is no account, no login, and no server storing anything.
          The coverage estimator runs entirely in your browser and the figures you
          enter are never sent anywhere. Policy document upload does not exist
          yet; when it does, this page will explain what happens to the document
          before you are asked to upload one.
        </p>
      </section>

      <Callout
        tone="info"
        title="Found something wrong?"
        className="mt-12"
      >
        <p>
          Data drifts. If a record here disagrees with what an insurer or hospital
          tells you, the insurer or hospital is right and this app is out of date
          — and the date each record was last checked is shown so you can see how
          stale it might be.
        </p>
      </Callout>
    </div>
  );
}
