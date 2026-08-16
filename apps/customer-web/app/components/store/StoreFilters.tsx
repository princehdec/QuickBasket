"use client";

import { cn } from "../../../lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "fast-delivery", label: "Fast Delivery" },
  { id: "top-rated", label: "Top Rated" },
  { id: "free-delivery", label: "Free Delivery" },
  { id: "open-now", label: "Open Now" },
] as const;

export type FilterId = (typeof filters)[number]["id"];

export function StoreFilters({
  active,
  onChange,
}: {
  active: FilterId;
  onChange: (id: FilterId) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95",
            active === f.id
              ? "border-brand-600 bg-brand-600 text-paper-50 shadow-[0_2px_8px_-2px_rgb(18_50_30/0.4)]"
              : "border-paper-300 bg-surface text-gray-700 hover:border-paper-400 hover:text-gray-900"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
