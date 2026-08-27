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

/**
 * A shield holding a check: cover, and the fact that it has been checked.
 * The whole product is about the difference between those two things.
 */
function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.6rem] bg-brand-600 shadow-sm"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[1.15rem] w-[1.15rem] text-white"
      >
        <path d="M12 3 4.5 6v5.6c0 4.3 3.1 7.6 7.5 8.9 4.4-1.3 7.5-4.6 7.5-8.9V6L12 3Z" />
        <path d="m9 12 2.2 2.2L15.4 10" />
      </svg>
    </span>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/80 bg-ink-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <Link
          href="/"
          className="focus-ring group flex items-center gap-2.5 self-start rounded-lg"
        >
          <BrandMark />

          <span className="flex flex-col leading-none">
            <span className="text-[1.0625rem] font-semibold tracking-tight text-ink-900">
              InsureGuide
            </span>
            <span className="mt-1 text-[0.6875rem] font-medium tracking-wide text-ink-500">
              Chennai &amp; Tamil Nadu
            </span>
          </span>
        </Link>

        <SiteNav items={NAV_ITEMS} />
      </div>
    </header>
  );
}
