/**
 * Shared form styling. Both the hospital filters (an uncontrolled server-side
 * GET form) and the coverage estimator (a client form) use these constants, so
 * a label or a control looks the same wherever it appears.
 */

export const FIELD_LABEL = "block text-sm font-medium text-slate-800";

export const FIELD_CONTROL =
  "focus-ring mt-1.5 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900 sm:text-sm";

export const FIELD_HINT = "mt-1.5 text-sm text-slate-500";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export function SelectField<T extends string>({
  id,
  name,
  label,
  options,
  defaultValue,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  options: SelectOption<T>[];
  defaultValue: T;
  hint?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>

      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-describedby={hintId}
        className={FIELD_CONTROL}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hint ? (
        <p id={hintId} className={FIELD_HINT}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxField({
  id,
  name,
  label,
  defaultChecked,
}: {
  id: string;
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    // The label wraps the row so the whole 44px strip toggles the checkbox, and
    // the box itself is 24px — the smallest target size WCAG 2.5.8 allows.
    <label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-slate-800"
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        value="1"
        defaultChecked={defaultChecked}
        className="focus-ring h-6 w-6 shrink-0 rounded border-slate-400 accent-teal-800"
      />

      <span>{label}</span>
    </label>
  );
}
