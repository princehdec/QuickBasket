import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * EmptyState — Kirana Modern
 * ------------------------------------------------------------------ *
 * One composed "nothing here yet" moment for the whole app: a dashed
 * price-tag ring around a tinted circle and a display-face title.
 * Replaces eight slightly-different hand-rolled copies.
 * ------------------------------------------------------------------ */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in",
        className
      )}
    >
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-paper-300" />
        <div className="absolute inset-2.5 rounded-full bg-brand-100/70" />
        <Icon size={30} className="relative text-brand-700" aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
