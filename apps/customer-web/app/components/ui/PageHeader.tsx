import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * PageHeader — Kirana Modern
 * ------------------------------------------------------------------ *
 * The sticky top bar shared by inner pages ( cart, checkout, orders ).
 * Frosted paper surface, circular back button, display-face title.
 * Replaces the copy-pasted per-page headers so they stay in sync.
 * ------------------------------------------------------------------ */

export function PageHeader({
  title,
  onBack,
  action,
  className,
}: {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-paper-200/80 bg-surface/90 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-100 text-gray-800 transition-all duration-150 hover:bg-paper-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        )}
        <h1 className="truncate font-display text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
          {title}
        </h1>
        {action && <div className="ml-auto flex shrink-0 items-center gap-2">{action}</div>}
      </div>
    </header>
  );
}
