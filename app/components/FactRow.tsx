import ProvenanceNote from "@/app/components/ProvenanceNote";
import type { Fact } from "@/app/data/provenance";
import type { ReactNode } from "react";

/**
 * One labelled field whose value may not be known.
 *
 * An unknown value renders as "Not verified" with the reason, never as a blank
 * or a plausible-looking guess.
 */
export default function FactRow<T>({
  label,
  fact,
  render,
}: {
  label: string;
  fact: Fact<T>;
  /** How to display a known value. Defaults to plain text. */
  render?: (value: T) => ReactNode;
}) {
  const known = fact.value !== null;

  return (
    <div className="bg-white p-4 sm:p-5">
      <dt className="text-sm text-slate-500">{label}</dt>

      <dd className="mt-1 font-medium text-slate-900">
        {known ? (
          render ? (
            render(fact.value as T)
          ) : (
            String(fact.value)
          )
        ) : (
          <span className="text-slate-500">Not verified</span>
        )}
      </dd>

      <ProvenanceNote provenance={fact.provenance} className="mt-2" />
    </div>
  );
}
