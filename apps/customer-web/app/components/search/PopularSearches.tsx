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
      <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-gray-900">
        <TrendingUp size={15} className="text-brand-600" />
        Popular Searches
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {popularSearches.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onSelect(term)}
            className="rounded-full border border-paper-300 bg-surface px-3.5 py-1.5 text-sm text-gray-700 transition-all duration-150 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 active:scale-95"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
