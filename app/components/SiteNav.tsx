"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Client-side only so the current section can be marked with `aria-current`,
 * which is how screen reader and keyboard users know where they are. The
 * active pill is the visual half of the same signal.
 */
export default function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
        {items.map((item) => {
          const isCurrent =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`focus-ring inline-block rounded-lg px-3 py-2 font-medium transition-colors ${
                  isCurrent
                    ? "bg-brand-100/70 text-brand-800"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
