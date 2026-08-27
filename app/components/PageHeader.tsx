import type { ReactNode } from "react";

/**
 * The top of every content page: a short eyebrow, the page title, and one
 * paragraph saying what the page is for. Keeping it in one component is what
 * makes the pages feel like one product rather than nine separate ones.
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
        <p className="text-sm font-medium uppercase tracking-wider text-teal-800">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>

      {intro ? (
        <div className="mt-4 text-lg leading-relaxed text-slate-600">
          {intro}
        </div>
      ) : null}
    </header>
  );
}
