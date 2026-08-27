import Link from "next/link";

import Callout from "@/app/components/Callout";

/**
 * The standing disclaimer on every page that shows real hospital or insurance
 * information. Wording is deliberate and must not be softened: InsureGuide is
 * a signpost, not a party to anyone's policy.
 */
export default function NotTheInsurerNotice({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Callout
      tone="caution"
      title="InsureGuide is not your insurer"
      className={className}
    >
      <p>
        We are not an insurer, a hospital, a broker or a TPA, and we have no
        access to your policy. Nothing here guarantees coverage, cashless
        treatment, claim approval or reimbursement.
      </p>

      <p>
        Information can go out of date between the day we checked it and the day
        you read it. Confirm the current position directly with your insurer and
        the hospital before you rely on it.{" "}
        <Link
          href="/trust"
          className="focus-ring rounded font-medium underline underline-offset-2 hover:text-caution-800"
        >
          How we source and label data
        </Link>
      </p>
    </Callout>
  );
}
