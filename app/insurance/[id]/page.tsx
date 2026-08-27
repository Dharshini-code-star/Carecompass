import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Callout from "@/app/components/Callout";
import DetailList from "@/app/components/DetailList";
import NotTheInsurerNotice from "@/app/components/NotTheInsurerNotice";
import PageHeader from "@/app/components/PageHeader";
import ProvenanceNote from "@/app/components/ProvenanceNote";
import VerificationBadge from "@/app/components/VerificationBadge";
import { getSource } from "@/app/data/sources";
import { getProduct, listProductIds } from "@/app/lib/products";

export async function generateStaticParams() {
  const ids = await listProductIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata(
  props: PageProps<"/insurance/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const product = await getProduct(id);

  if (!product) return { title: "Product not found" };

  return {
    title: `${product.productName} (${product.uin})`,
    description: `${product.productName} from ${product.insurer.name}. UIN, IRDAI approval date, and a link to the policy wording.`,
  };
}

export default async function ProductDetailsPage(
  props: PageProps<"/insurance/[id]">,
) {
  const { id } = await props.params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const irdai = getSource("irdai-health-products");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/insurance"
        className="focus-ring rounded text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← All products
      </Link>

      <div className="mt-6">
        <PageHeader
          eyebrow={product.insurer.category}
          title={product.productName}
          intro={<p>{product.insurer.name}</p>}
        />
      </div>

      <div className="mt-5 surface rounded-xl bg-white p-4">
        <ProvenanceNote provenance={product.provenance} />
      </div>

      <NotTheInsurerNotice className="mt-8" />

      <section aria-labelledby="registry-heading" className="mt-12">
        <h2
          id="registry-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          Regulatory record
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          These are the facts the regulator publishes about this product. The
          UIN is the number to quote when you ask an insurer or agent about it —
          it identifies the exact product and version.
        </p>

        <div className="mt-5">
          <DetailList
            items={[
              { label: "Insurer", value: product.insurer.name },
              {
                label: "Product name",
                value: product.productName,
                hint: "As published by IRDAI.",
              },
              {
                label: "UIN",
                value: (
                  <span className="font-mono break-all">{product.uin}</span>
                ),
                hint: "Unique Identification Number allotted by IRDAI.",
              },
              {
                label: "IRDAI approval date",
                value: product.approvalDate,
                hint: "The date of approval recorded in IRDAI's table.",
              },
              {
                label: "IRDAI product type",
                value: product.irdaiProductTypeLabel ?? (
                  <span className="text-ink-500">Not recorded</span>
                ),
                hint:
                  product.irdaiProductTypeLabel === null
                    ? "We did not capture this column for this record, so it is left empty rather than filled in."
                    : "The label IRDAI applies in its own table.",
              },
              {
                label: "Financial year of filing",
                value: product.financialYear ?? (
                  <span className="text-ink-500">Not recorded</span>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="document-heading" className="mt-12">
        <h2
          id="document-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          The policy wording
        </h2>

        <p className="mt-3 leading-relaxed text-ink-600">
          Everything that decides what this policy pays — sum insured options,
          room rent limits, waiting periods, co-payment, sub-limits and
          exclusions — is in this document, not in our database. It is the
          version IRDAI holds for this UIN.
        </p>

        <a
          href={product.policyDocumentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-5 inline-flex min-h-11 items-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Open the policy document (PDF, on irdai.gov.in)
        </a>

        <Callout tone="caution" title="Check you have the current version" className="mt-6">
          <p>
            Insurers revise products, and each revision gets a new UIN. The
            document above is the version IRDAI held when we checked on{" "}
            {product.provenance.lastVerified ?? "an unrecorded date"}. Before
            relying on any figure, confirm with the insurer that this UIN is the
            product you are actually being offered.
          </p>
        </Callout>
      </section>

      <section aria-labelledby="network-heading" className="mt-12">
        <h2
          id="network-heading"
          className="text-xl font-semibold tracking-tight text-ink-900"
        >
          Which hospitals accept it
        </h2>

        <div className="mt-4 surface rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <p className="font-medium text-ink-900">
              Network status at every hospital
            </p>
            <VerificationBadge status="not-verified" />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            We do not publish a hospital network for this product, and we will
            not guess one. Network lists are set per insurer and can differ
            between two policies from the same insurer, they change without
            notice, and being wrong about one at an admission desk costs real
            money.
          </p>

          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            Ask {product.insurer.name} directly, quoting UIN {product.uin} and
            your policy number, and confirm again with the hospital&apos;s
            insurance desk before admission.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/hospitals"
            className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Browse Chennai hospitals
          </Link>

          <Link
            href="/claims"
            className="focus-ring rounded font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            How cashless and reimbursement work
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="source-heading"
        className="mt-12 surface rounded-xl bg-white p-5 sm:p-6"
      >
        <h2 id="source-heading" className="font-semibold text-ink-900">
          Source
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {irdai.name}, {irdai.publisher}.
        </p>

        {irdai.url ? (
          <a
            href={irdai.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-3 inline-block rounded text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Look this UIN up yourself
          </a>
        ) : null}
      </section>

      <Link
        href="/insurance"
        className="focus-ring mt-10 inline-block rounded text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← All products
      </Link>
    </div>
  );
}
