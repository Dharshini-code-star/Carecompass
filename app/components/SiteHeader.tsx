import Link from "next/link";

import SiteNav, { type NavItem } from "@/app/components/SiteNav";

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/hospitals", label: "Find Hospitals" },
  { href: "/compare", label: "Compare" },
  { href: "/ask", label: "Ask AI" },
];

function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-700 shadow-sm"
    >
      <span className="absolute h-5 w-5 rounded-full border border-white/65" />
      <span className="absolute h-2.5 w-2.5 rotate-45 border-l-2 border-t-2 border-white" />
    </span>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/80 bg-ink-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <Link
          href="/"
          className="focus-ring group flex items-center gap-2.5 self-start rounded-lg"
        >
          <BrandMark />
          <span className="flex flex-col leading-none">
            <span className="text-[1.0625rem] font-semibold text-ink-900">
              CareCompass
            </span>
            <span className="mt-1 text-[0.6875rem] font-medium tracking-wide text-ink-500">
              Healthcare navigation
            </span>
          </span>
        </Link>
        <SiteNav items={NAV_ITEMS} />
      </div>
    </header>
  );
}
