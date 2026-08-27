import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const BASE =
  "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-150 active:translate-y-px";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md disabled:bg-ink-200 disabled:text-ink-500 disabled:shadow-none",
  secondary:
    "border border-ink-300 bg-white text-ink-800 shadow-xs hover:border-ink-400 hover:bg-ink-50 hover:shadow-sm disabled:border-ink-200 disabled:text-ink-400 disabled:shadow-none",
  ghost:
    "text-ink-700 hover:bg-ink-100 hover:text-ink-900 disabled:text-ink-400",
};

function classes(variant: Variant, className?: string) {
  return [BASE, VARIANTS[variant], className].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={`${classes(variant, className)} disabled:cursor-not-allowed disabled:active:translate-y-0`}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "secondary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={classes(variant, className)} {...props} />;
}
