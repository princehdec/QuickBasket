"use client";

import { TrendingUp } from "lucide-react";
import { popularSearches } from "../../../lib/mock/searchKeywords";

export function PopularSearches({
  onSelect,
}: {
  onSelect: (term: string) => void;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
        <TrendingUp size={15} className="text-brand-500" />
        Popular Searches
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {popularSearches.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onSelect(term)}
            className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm text-gray-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
