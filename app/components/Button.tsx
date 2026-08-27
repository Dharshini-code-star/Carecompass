import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const BASE =
  "focus-ring inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-teal-800 text-white hover:bg-teal-900 disabled:bg-slate-200 disabled:text-slate-600",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400",
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
      className={`${classes(variant, className)} disabled:cursor-not-allowed`}
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
