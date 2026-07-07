"use client";

import { SearchX } from "lucide-react";

export function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <SearchX size={36} />
      </span>
      <h2 className="mt-5 text-lg font-bold text-gray-900">No results found</h2>
      <p className="mt-1.5 max-w-xs text-sm text-gray-500">
        We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Try searching for a different term.
      </p>
    </div>
  );
}
