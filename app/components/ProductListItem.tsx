import Link from "next/link";

import VerificationBadge from "@/app/components/VerificationBadge";
import type { ProductRecord } from "@/app/lib/products";

export default function ProductListItem({
  product,
}: {
  product: ProductRecord;
}) {
  return (
    <li>
      <Link
        href={`/insurance/${product.id}`}
        className="focus-ring group block px-5 py-5 transition-colors hover:bg-ink-50 sm:px-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="text-base font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
            {product.productName}
          </h3>

          <VerificationBadge status={product.provenance.status} />
        </div>

        <p className="mt-1.5 text-sm text-ink-500">{product.insurer.name}</p>

        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-500">
              UIN
            </dt>
            <dd
              className="mt-1 font-mono text-sm font-medium text-ink-800"
              data-numeric
            >
              {product.uin}
            </dd>
          </div>

          <div>
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-500">
              IRDAI approval
            </dt>
            <dd className="mt-1 text-sm font-medium text-ink-800" data-numeric>
              {product.approvalDate}
            </dd>
          </div>
        </dl>
      </Link>
    </li>
  );
}
