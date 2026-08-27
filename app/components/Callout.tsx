import type { ReactNode } from "react";

type Tone = "caution" | "info";

const TONES: Record<
  Tone,
  { wrapper: string; icon: string; heading: string; body: string }
> = {
  caution: {
    wrapper: "border-caution-200 bg-caution-50",
    icon: "bg-caution-100 text-caution-700",
    heading: "text-caution-800",
    body: "text-caution-800/85",
  },
  info: {
    wrapper: "border-ink-200 bg-white",
    icon: "bg-brand-50 text-brand-700",
    heading: "text-ink-900",
    body: "text-ink-600",
  },
};

/**
 * A bordered note. Used for the standing "we are not your insurer" warning,
 * "not built yet" notices, and anything else the reader must not skim past.
 *
 * The icon is functional rather than ornamental: it is the only thing that
 * distinguishes a caution from an aside at a glance while scrolling.
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
      className={`rounded-xl border p-5 shadow-xs sm:p-6 ${styles.wrapper} ${className}`}
    >
      <div className="flex gap-3.5">
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="h-4 w-4"
          >
            {tone === "caution" ? (
              <>
                <path d="M12 8.5v4.2" />
                <path d="M12 16.4h.01" />
                <path d="M10.3 3.9 2.4 17.6A1.9 1.9 0 0 0 4 20.5h16a1.9 1.9 0 0 0 1.6-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z" />
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <path d="M12 8h.01" />
              </>
            )}
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <h2 className={`text-sm font-semibold ${styles.heading}`}>{title}</h2>

          <div
            className={`mt-2 space-y-2.5 text-sm leading-relaxed ${styles.body}`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
