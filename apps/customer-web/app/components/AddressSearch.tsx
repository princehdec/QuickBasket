"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import type { Location } from "../context/LocationContext";

const dummyResults: Location[] = [
  { id: "gnt", label: "Gomti Nagar", address: "Phase 2, Gomti Nagar", city: "Lucknow" },
  { id: "ind", label: "Indira Nagar", address: "Indira Nagar Colony", city: "Lucknow" },
  { id: "hzt", label: "Hazratganj", address: "Hazratganj Market", city: "Lucknow" },
  { id: "alb", label: "Alambagh", address: "Alambagh Bus Station", city: "Lucknow" },
];

export function AddressSearch({ onSelect }: { onSelect: (loc: Location) => void }) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? dummyResults.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.city.toLowerCase().includes(query.toLowerCase())
      )
    : dummyResults;

  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-bold text-gray-900">Search Address</h3>
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for area, street, city..."
          className="h-11 w-full rounded-button border border-paper-300 bg-paper-50 pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-paper-500 transition-colors focus:border-brand-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="mt-3 space-y-1">
        {filtered.map((result) => (
          <button
            key={result.id}
            type="button"
            onClick={() => onSelect(result)}
            className="flex w-full items-center gap-3 rounded-button p-3 text-left transition-colors hover:bg-paper-100/80"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <MapPin size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{result.label}</p>
              <p className="mt-0.5 text-xs text-gray-600">
                {result.address}, {result.city}
              </p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}
