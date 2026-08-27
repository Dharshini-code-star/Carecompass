import Link from "next/link";

import Callout from "@/app/components/Callout";

/**
 * Used only where invented teaching examples appear. Real records never render
 * this — they carry their own source and verification status instead.
 */
export default function DemoDataNotice({
  subject,
  className = "",
}: {
  /** What is being shown, e.g. "policies". */
  subject: string;
  className?: string;
}) {
  return (
    <Callout tone="caution" title="Demo data — not real" className={className}>
      <p>
        The {subject} below are invented. The insurers do not exist, the products
        do not exist, and none of the figures describe anything you can buy.
      </p>

      <p>
        They are here so the structure of a health policy can be explained and so
        the coverage estimator has numbers to work through. For real products,
        see{" "}
        <Link
          href="/insurance"
          className="focus-ring rounded font-medium underline underline-offset-2 hover:text-amber-950"
        >
          the IRDAI-listed products
        </Link>
        .
      </p>
    </Callout>
  );
}
