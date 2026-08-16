import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * Section / Container / headings — Kirana Modern
 * ------------------------------------------------------------------ *
 * Display headings use the Baloo display face with tightened tracking;
 * vertical rhythm breathes a little more at the bottom than the top.
 * ------------------------------------------------------------------ */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("py-8 sm:py-12 lg:py-14", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
      <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function ViewAllLink({
  label = "View All",
}: { label?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <span className="group inline-flex cursor-pointer items-center gap-1 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700">
      {label}
      <ChevronRight
        size={14}
        className="transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </span>
  );
}
