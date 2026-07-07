"use client";

import { Briefcase, Home, MapPin } from "lucide-react";
import type { Location } from "../context/LocationContext";

const savedAddresses: Location[] = [
  { id: "home", label: "Home", address: "123, Aliganj", city: "Lucknow", pincode: "226024" },
  { id: "work", label: "Work", address: "456, Gomti Nagar", city: "Lucknow", pincode: "226010" },
  { id: "other", label: "Other", address: "789, Hazratganj", city: "Lucknow", pincode: "226001" },
];

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home size={18} />,
  Work: <Briefcase size={18} />,
  Other: <MapPin size={18} />,
};

const colorMap: Record<string, string> = {
  Home: "bg-amber-50 text-amber-600",
  Work: "bg-blue-50 text-blue-600",
  Other: "bg-gray-100 text-gray-600",
};

export function SavedAddresses({ onSelect }: { onSelect: (loc: Location) => void }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Saved Addresses</h3>
      <div className="space-y-2.5">
        {savedAddresses.map((addr) => (
          <button
            key={addr.id}
            type="button"
            onClick={() => onSelect(addr)}
            className="flex w-full items-center gap-3.5 rounded-card border border-gray-100 p-4 text-left transition-all hover:border-gray-200 hover:shadow-sm"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorMap[addr.label] || colorMap.Other}`}
            >
              {iconMap[addr.label] || iconMap.Other}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{addr.label}</p>
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {addr.address}, {addr.city}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
