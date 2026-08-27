import type { Metadata } from "next";
import Link from "next/link";

import Callout from "@/app/components/Callout";
import NotTheInsurerNotice from "@/app/components/NotTheInsurerNotice";
import PageHeader from "@/app/components/PageHeader";
import ProductListItem from "@/app/components/ProductListItem";
import { SelectField } from "@/app/components/Field";
import { Button, LinkButton } from "@/app/components/Button";
import { getSource } from "@/app/data/sources";
import {
  INSURER_OPTIONS,
  TOTAL_REAL_INSURERS,
  TOTAL_REAL_PRODUCTS,
  listProducts,
  parseInsurerFilter,
} from "@/app/lib/products";

export const metadata: Metadata = {
  title: "Explore insurance",
  description:
    "Real health insurance products from the IRDAI database, with their UIN, approval date and a link to the actual policy wording.",
};

export default async function InsurancePage(props: PageProps<"/insurance">) {
  const params = await props.searchParams;
  const insurer = parseInsurerFilter(params);
  const products = await listProducts(insurer);
  const source = getSource("irdai-health-products");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="IRDAI-listed products"
        title="Explore insurance"
        intro={
          <p>
            {TOTAL_REAL_PRODUCTS} real health insurance products from{" "}
            {TOTAL_REAL_INSURERS} insurers, read from the regulator&apos;s own
            database. Each one links to the policy wording IRDAI holds for it.
          </p>
        }
      />

      <NotTheInsurerNotice className="mt-8" />

      <Callout
        tone="info"
        title="Why there are no premiums or cover amounts here"
        className="mt-4"
      >
        <p>
          Sum insured, room rent limits, waiting periods, co-payment and
          exclusions live in the policy wording, and insurers revise them. Copying
          those figures into an app is how people end up relying on a number that
          changed two years ago, so we link to the document instead of retyping
          it.
        </p>

        <p>
          A product appearing in IRDAI&apos;s database means the regulator
          approved it for sale. It does not mean it is still on sale, that it
          suits you, or that any hospital accepts it.
        </p>
      </Callout>

      <form
        method="GET"
        action="/insurance"
        autoComplete="off"
        aria-labelledby="filter-heading"
        className="mt-10 surface rounded-xl bg-white p-5 sm:p-6"
      >
        <h2
          id="filter-heading"
          className="text-base font-semibold text-ink-900"
        >
          Filter by insurer
        </h2>

        <div className="mt-4">
          <SelectField
            key={insurer}
            id="insurer"
            name="insurer"
            label="Insurer"
            options={INSURER_OPTIONS}
            defaultValue={insurer}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" variant="primary">
            Search
          </Button>
          <LinkButton href="/insurance">Clear filter</LinkButton>
        </div>
      </form>

      <section aria-labelledby="products-heading" className="mt-10">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <p aria-live="polite" className="text-sm text-ink-600">
          {products.length === 1
            ? "1 product matches."
            : `${products.length} products ${insurer === "any" ? "in the dataset" : "match"}.`}
        </p>

        {products.length > 0 ? (
          <ul className="mt-4 surface divide-y divide-ink-200 overflow-hidden rounded-xl">
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-ink-300 bg-white p-8">
            <h3 className="font-semibold text-ink-900">
              No products from that insurer in this dataset
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              This is a small selection from IRDAI&apos;s database, not every
              product it lists.
            </p>
            <LinkButton href="/insurance" className="mt-5">
              Clear filter
            </LinkButton>
          </div>
        )}
      </section>

      <section
        aria-labelledby="source-heading"
        className="mt-12 surface rounded-xl bg-white p-5 sm:p-6"
      >
        <h2 id="source-heading" className="font-semibold text-ink-900">
          Where this comes from
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {source.name}, published by {source.publisher}.{" "}
          {source.authoritativeFor}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          Records were only kept where the policy document IRDAI hosts is named
          after the same UIN as the row it appears in — a few rows in that table
          link to a document belonging to a different product, and those were
          dropped rather than guessed at.
        </p>

        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-4 inline-block rounded text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Search the IRDAI database yourself
          </a>
        ) : null}
      </section>

      <section aria-labelledby="demo-heading" className="mt-12">
        <h2
          id="demo-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          Teaching examples
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Because real products are shown as facts and links rather than copied
          figures, there is nothing here to practise reading. A separate set of{" "}
          <strong>invented</strong> policies carries figures so the structure of a
          policy can be explained and the coverage estimator has something to work
          through. They are labelled DEMO DATA wherever they appear.
        </p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/demo-policies"
            className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            See the teaching examples
          </Link>

          <Link
            href="/understand-policy"
            className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            What the terms mean
          </Link>

          <Link
            href="/coverage-estimator"
            className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Try the coverage estimator
          </Link>
        </div>
      </section>
    </div>
  );
}
