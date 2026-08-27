import Link from "next/link";

const TOOLS = [
  { href: "/hospitals", label: "Find a hospital" },
  { href: "/facility-check", label: "Check a facility" },
  { href: "/insurance", label: "Explore insurance" },
  { href: "/understand-policy", label: "Understand my policy" },
  { href: "/coverage-estimator", label: "Coverage estimator" },
  { href: "/claims", label: "Claim help" },
];

const ABOUT = [
  { href: "/trust", label: "Where our data comes from" },
  { href: "/demo-policies", label: "Teaching examples (demo)" },
  { href: "/hospital-help", label: "At the hospital (coming soon)" },
];

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="label-eyebrow text-ink-500">{title}</h2>

      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="focus-ring rounded text-ink-600 transition-colors hover:text-brand-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="text-base font-semibold tracking-tight text-ink-900">
              InsureGuide
            </p>
            <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-ink-500">
              Plain-English health insurance guidance for Chennai and Tamil
              Nadu. Every record shows its source and what has been checked.
            </p>
          </div>

          <FooterLinks title="Tools" links={TOOLS} />
          <FooterLinks title="About" links={ABOUT} />
        </div>

        <div className="mt-12 border-t border-ink-200 pt-7">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-500">
            InsureGuide is an information tool. It is not an insurer, a hospital,
            a broker or a TPA. It does not guarantee insurance coverage, cashless
            treatment, claim approval or reimbursement, and it is not insurance,
            medical or financial advice. Confirm coverage and claim requirements
            with your insurer and the hospital.
          </p>

          <p className="mt-4 text-sm text-ink-500">
            Hospital and product records carry their source and the date they
            were last verified. Anything invented is labelled DEMO DATA.
          </p>
        </div>
      </div>
    </footer>
  );
}
