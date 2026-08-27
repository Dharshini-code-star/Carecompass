import type { ReactNode } from "react";

/**
 * The top of every content page: a short eyebrow, the page title, and one
 * paragraph saying what the page is for. Keeping it in one component is what
 * makes the pages feel like one product rather than ten separate ones.
 */
export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="label-eyebrow flex items-center gap-2 text-brand-700">
          <span aria-hidden="true" className="h-px w-6 bg-brand-300" />
          {eyebrow}
        </p>
      ) : null}

      <h1
        className={`text-[2rem] font-semibold leading-[1.12] text-ink-900 sm:text-[2.6rem] ${
          eyebrow ? "mt-3.5" : ""
        }`}
      >
        {title}
      </h1>

      {intro ? (
        <div className="mt-5 text-lg leading-[1.65] text-ink-600">{intro}</div>
      ) : null}
    </header>
  );
}
