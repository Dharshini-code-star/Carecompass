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
        className="focus-ring block px-5 py-5 transition-colors hover:bg-slate-50 sm:px-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="text-base font-semibold text-slate-900">
            {product.productName}
          </h3>

          <VerificationBadge status={product.provenance.status} />
        </div>

        <p className="mt-1 text-sm text-slate-600">{product.insurer.name}</p>

        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-600">
              UIN
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-slate-900">
              {product.uin}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-600">
              IRDAI approval date
            </dt>
            <dd className="mt-0.5 text-sm text-slate-900">
              {product.approvalDate}
            </dd>
          </div>
        </dl>
      </Link>
    </li>
  );
}
