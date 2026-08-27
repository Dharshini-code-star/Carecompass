import Link from "next/link";

import SiteNav, { type NavItem } from "@/app/components/SiteNav";

/**
 * Four links only. Anything more turns the header into a menu that has to be
 * hidden behind a button on small screens; at four they simply wrap onto a
 * second line. The full set of pages lives in the footer.
 */
const NAV_ITEMS: NavItem[] = [
  { href: "/hospitals", label: "Hospitals" },
  { href: "/insurance", label: "Insurance" },
  { href: "/coverage-estimator", label: "Estimate cover" },
  { href: "/claims", label: "Claim help" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6">
        <Link
          href="/"
          className="focus-ring rounded text-lg font-semibold tracking-tight text-slate-900"
        >
          InsureGuide
        </Link>

        <SiteNav items={NAV_ITEMS} />
      </div>
    </header>
  );
}
