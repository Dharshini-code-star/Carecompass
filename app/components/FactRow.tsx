import type { ReactNode } from "react";

import ProvenanceNote from "@/app/components/ProvenanceNote";
import type { Fact } from "@/app/data/provenance";

export default function FactRow<T>({
  label,
  fact,
  render,
}: {
  label: string;
  fact: Fact<T>;
  render?: (value: T) => ReactNode;
}) {
  const known = fact.value !== null;

  return (
    <div className="bg-white p-4 sm:p-5">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="mt-1 font-medium text-ink-900">
        {known ? render ? render(fact.value as T) : String(fact.value) : "Unknown"}
      </dd>
      {!known ? (
        <p className="mt-1 text-sm text-ink-500">
          No verified source available.
        </p>
      ) : null}
      <ProvenanceNote provenance={fact.provenance} className="mt-2" />
    </div>
  );
}
