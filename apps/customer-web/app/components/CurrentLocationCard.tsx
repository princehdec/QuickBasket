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
      className="flex w-full items-center gap-3.5 rounded-card border border-brand-200 bg-brand-50/60 p-4 text-left transition-all hover:bg-brand-100/70 hover:shadow-soft"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-paper-50 shadow-[0_3px_10px_-2px_rgb(18_50_30/0.4)]">
        <Navigation size={20} />
      </span>
      <div>
        <p className="font-display text-sm font-bold text-gray-900">Use Current Location</p>
        <p className="mt-0.5 text-xs text-gray-600">GPS will detect your address</p>
      </div>
    </button>
  );
}
