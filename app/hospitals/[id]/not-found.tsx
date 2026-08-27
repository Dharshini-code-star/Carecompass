import type { Metadata } from "next";

import NotFoundPanel from "@/app/components/NotFoundPanel";

export const metadata: Metadata = { title: "Hospital not found" };

export default function HospitalNotFound() {
  return (
    <NotFoundPanel
      title="Hospital not found"
      description="There is no hospital with that ID in the demo dataset. It may have been removed, or the link may be incorrect."
      links={[
        { href: "/hospitals", label: "Back to all hospitals" },
        { href: "/", label: "Go to the home page" },
      ]}
    />
  );
}
