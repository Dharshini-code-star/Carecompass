import Link from "next/link";

import Callout from "@/app/components/Callout";

export default function NotTheInsurerNotice({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Callout
      tone="caution"
      title="CareCompass is not your insurer"
      className={className}
    >
      <p>
        We do not guarantee coverage, cashless treatment, claims or reimbursement.
        Confirm details with your insurer and hospital.{" "}
        <Link
          href="/trust"
          className="focus-ring rounded font-medium underline underline-offset-2 hover:text-caution-800"
        >
          Data and evidence
        </Link>
      </p>
    </Callout>
  );
}
