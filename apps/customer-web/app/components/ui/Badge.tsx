import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * Badge
 * ------------------------------------------------------------------ *
 * Inline status pill with 3 semantic styles:
 *   default — neutral grey    (Coming Soon, etc.)
 *   accent  — brand orange    (Popular, Fastest, etc.)
 *   muted   — light grey ring  (subtle labels)
 * ------------------------------------------------------------------ */

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: "default" | "accent" | "muted";
};

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-gray-100 text-gray-600",
  accent:  "bg-brand-500 text-white shadow-sm shadow-brand-500/20",
  muted:   "bg-gray-100/80 text-gray-500 border border-gray-200/60",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}