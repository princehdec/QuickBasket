"use client";

import { Navigation } from "lucide-react";
import type { Location } from "../context/LocationContext";

const currentLocation: Location = {
  id: "current",
  label: "Current Location",
  address: "Use GPS",
  city: "Detect your location",
};

export function CurrentLocationCard({ onSelect }: { onSelect: (loc: Location) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(currentLocation)}
      className="flex w-full items-center gap-3.5 rounded-card border border-brand-200 bg-brand-50/50 p-4 text-left transition-all hover:bg-brand-50 hover:shadow-sm"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm">
        <Navigation size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">Use Current Location</p>
        <p className="mt-0.5 text-xs text-gray-500">GPS will detect your address</p>
      </div>
    </button>
  );
}
