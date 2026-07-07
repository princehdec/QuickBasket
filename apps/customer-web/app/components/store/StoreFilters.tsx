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
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            active === f.id
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
