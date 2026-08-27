import type { Metadata } from "next";

import NotFoundPanel from "@/app/components/NotFoundPanel";

export const metadata: Metadata = { title: "Demo policy not found" };

export default function DemoPolicyNotFound() {
  return (
    <NotFoundPanel
      title="Demo policy not found"
      description="There is no teaching example with that ID. It may have been removed, or the link may be incorrect."
      links={[
        { href: "/demo-policies", label: "Back to the teaching examples" },
        { href: "/insurance", label: "Real IRDAI-listed products" },
      ]}
    />
  );
}
