"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Client-side only so the current section can be marked with `aria-current`,
 * which is how screen reader and keyboard users know where they are.
 */
export default function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {items.map((item) => {
          const isCurrent =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`focus-ring inline-block rounded py-1 transition-colors ${
                  isCurrent
                    ? "font-medium text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
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
