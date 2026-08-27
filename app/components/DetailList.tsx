import type { ReactNode } from "react";

export interface Detail {
  label: string;
  value: ReactNode;
  /** Optional plain-English note shown under the value. */
  hint?: string;
}

/**
 * Label/value pairs in a consistent order and layout. Used on the hospital and
 * policy detail pages so the same fact always sits in the same place.
 */
export default function DetailList({ items }: { items: Detail[] }) {
  return (
    <dl
      className="surface grid gap-px overflow-hidden rounded-xl bg-ink-200 sm:grid-cols-2"
    >
      {items.map((item) => (
        <div key={item.label} className="bg-white p-4 sm:p-5">
          <dt className="text-sm text-ink-500">{item.label}</dt>

          <dd className="mt-1 font-medium text-ink-900">{item.value}</dd>

          {item.hint ? (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
              {item.hint}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
