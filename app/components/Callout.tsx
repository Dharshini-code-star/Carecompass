import type { ReactNode } from "react";

type Tone = "caution" | "info";

const TONES: Record<Tone, { wrapper: string; heading: string; body: string }> = {
  caution: {
    wrapper: "border-amber-300 bg-amber-50",
    heading: "text-amber-900",
    body: "text-amber-900/90",
  },
  info: {
    wrapper: "border-slate-200 bg-slate-50",
    heading: "text-slate-900",
    body: "text-slate-600",
  },
};

/**
 * A bordered note. Used for the standing demo-data warning, "not built yet"
 * notices, and anything else the user must not skim past.
 */
export default function Callout({
  tone = "info",
  title,
  children,
  className = "",
}: {
  tone?: Tone;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const styles = TONES[tone];

  return (
    <section
      className={`rounded-md border ${styles.wrapper} p-5 ${className}`}
    >
      <h2 className={`text-sm font-semibold ${styles.heading}`}>{title}</h2>

      <div className={`mt-2 space-y-2 text-sm leading-relaxed ${styles.body}`}>
        {children}
      </div>
    </section>
  );
}
