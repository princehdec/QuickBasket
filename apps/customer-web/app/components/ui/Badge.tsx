import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * Badge — Kirana Modern
 * ------------------------------------------------------------------ *
 * Small price-tag style label. Pill-shaped for counts & statuses;
 * colour lanes follow the system:
 *   default — warm neutral   ( Coming Soon, etc. )
 *   accent  — brand green    ( Popular, Fastest, etc. )
 *   offer   — turmeric       ( discounts, promo tags )
 *   khata   — ledger red     ( khata credit states )
 *   muted   — hairline ring  ( subtle labels )
 * ------------------------------------------------------------------ */

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: "default" | "accent" | "muted" | "offer" | "khata" | "success";
};

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-paper-100 text-gray-700",
  accent: "bg-brand-600 text-paper-50 shadow-[0_1px_6px_-1px_rgb(18_50_30/0.4)]",
  offer: "bg-turmeric-100 text-turmeric-700",
  khata: "bg-khata-100 text-khata-700",
  success: "bg-brand-100 text-brand-800",
  muted: "bg-surface/80 text-gray-600 border border-paper-300/60",
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
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
