"use client";

import { Clock, X } from "lucide-react";
import { useSearch } from "../../contexts/SearchContext";

export function RecentSearches({
  onSelect,
}: {
  onSelect: (term: string) => void;
}) {
  const { recentSearches, removeRecentSearch, clearRecentSearches } = useSearch();

  if (recentSearches.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-gray-900">Recent Searches</h3>
        <button
          type="button"
          onClick={clearRecentSearches}
          className="text-xs font-bold text-gray-500 transition-colors hover:text-error"
        >
          Clear All
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {recentSearches.map((term) => (
          <span
            key={term}
            className="inline-flex items-center gap-1.5 rounded-full bg-paper-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-paper-200"
          >
            <button
              type="button"
              onClick={() => onSelect(term)}
              className="flex items-center gap-1.5"
            >
              <Clock size={13} className="text-paper-500" />
              {term}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeRecentSearch(term);
              }}
              aria-label={`Remove ${term} from recent searches`}
              className="ml-0.5 rounded-full p-0.5 text-paper-500 transition-colors hover:bg-paper-300 hover:text-gray-700"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
