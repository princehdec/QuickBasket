import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * Card — Kirana Modern
 * ------------------------------------------------------------------ *
 * Warm paper-white surface, hairline border, soft ink-tinted shadow.
 * Elevation (not borders) communicates hierarchy, so hover lifts
 * rather than darkens.
 * ------------------------------------------------------------------ */

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface rounded-card border border-paper-200/70 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        className
      )}
      {...props}
    />
  );
}

export function CardImage({
  children,
  className,
  ...props
}: { children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative h-36 w-full overflow-hidden rounded-t-card bg-gradient-to-br from-brand-50 via-brand-100 to-turmeric-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}
