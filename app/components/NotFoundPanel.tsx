import Link from "next/link";

import PageHeader from "@/app/components/PageHeader";

export default function NotFoundPanel({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
      <PageHeader title={title} intro={<p>{description}</p>} />

      <ul className="mt-8 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="focus-ring rounded font-medium text-teal-800 underline underline-offset-4 hover:text-teal-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
