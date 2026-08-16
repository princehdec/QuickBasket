"use client";

import { cn } from "../../../lib/utils";

export type TabId = "all" | "products" | "stores";

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "products", label: "Products" },
  { id: "stores", label: "Stores" },
];

export function SearchTabs({
  active,
  onChange,
  counts,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
  counts?: Record<TabId, number>;
}) {
  return (
    <div className="border-b border-paper-200/80 bg-surface">
      <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6 lg:px-8">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const count = counts?.[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3 font-display text-sm font-bold transition-colors",
                isActive
                  ? "text-brand-700"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {tab.label}
              {count !== undefined && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums",
                    isActive
                      ? "bg-brand-100 text-brand-800"
                      : "bg-paper-100 text-gray-600"
                  )}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-brand-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
