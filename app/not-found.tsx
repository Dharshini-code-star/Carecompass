import type { Metadata } from "next";

import NotFoundPanel from "@/app/components/NotFoundPanel";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <NotFoundPanel
      title="Page not found"
      description="That page does not exist. It may have moved, or the link may be incomplete."
      links={[
        { href: "/", label: "Go to the home page" },
        { href: "/hospitals", label: "Find a hospital" },
        { href: "/insurance", label: "Explore insurance" },
        { href: "/claims", label: "Claim help" },
      ]}
    />
  );
}
