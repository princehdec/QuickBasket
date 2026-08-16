"use client";

import { SearchX } from "lucide-react";
import { EmptyState } from "../ui/EmptyState";

export function NoResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No results found"
      description={`We couldn't find anything for "${query}". Try searching for a different term.`}
    />
  );
}
