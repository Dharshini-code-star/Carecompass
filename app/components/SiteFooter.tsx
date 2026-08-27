import Link from "next/link";

const TOOLS = [
  { href: "/hospitals", label: "Find a hospital" },
  { href: "/insurance", label: "Explore insurance" },
  { href: "/understand-policy", label: "Understand my policy" },
  { href: "/coverage-estimator", label: "Coverage estimator" },
  { href: "/claims", label: "Claim help" },
  { href: "/demo-policies", label: "Teaching examples (demo)" },
];

const ABOUT = [
  { href: "/trust", label: "Where our data comes from" },
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
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="focus-ring rounded text-slate-600 transition-colors hover:text-slate-900"
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
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <FooterLinks title="Tools" links={TOOLS} />
          <FooterLinks title="About" links={ABOUT} />
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
            InsureGuide is an information tool. It does not guarantee insurance
            coverage, cashless treatment, claim approval, or reimbursement, and
            it is not insurance, medical, or financial advice. Confirm coverage
            and claim requirements with your insurer and the hospital.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Hospital and product records carry their source and the date they
            were last verified. Anything invented is labelled DEMO DATA. Focused
            on Chennai, Tamil Nadu.
          </p>
        </div>
      </div>
    </footer>
  );
}
