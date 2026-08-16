"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@quickbasket/ui";

/* Shared Kirana Modern chrome for the khata module. The khata screens
   keep their own red-lane identity but sit on the same paper surfaces,
   Baloo headings and tactile controls as the rest of the app. */

export const khataInputClass =
  "h-12 w-full rounded-button border border-paper-300 bg-paper-50 px-3.5 text-sm text-gray-900 placeholder:text-paper-400 transition-colors focus:border-khata-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-khata-100";

export function KhataHeader({
  title,
  onBack,
  children,
  className,
}: {
  title: ReactNode;
  onBack?: () => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 border-b border-paper-200/80 bg-surface/95 px-4 py-4 shadow-soft backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-100 text-gray-800 transition-all duration-150 hover:bg-paper-200 active:scale-95"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        )}
        <h1 className="truncate font-display text-xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
}

export function KhataTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex-1 py-2.5 font-display text-sm font-bold transition-colors",
            active === tab.id ? "text-khata-700" : "text-gray-500 hover:text-gray-800"
          )}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-khata-600" />
          )}
        </button>
      ))}
    </div>
  );
}

export function InitialTile({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-khata-100 font-display text-base font-extrabold text-khata-700",
        className
      )}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  );
}
