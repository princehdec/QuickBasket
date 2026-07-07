"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLocation, type Location } from "../context/LocationContext";
import { CurrentLocationCard } from "./CurrentLocationCard";
import { AddressSearch } from "./AddressSearch";
import { SavedAddresses } from "./SavedAddresses";
import { AddressConfirmation } from "./AddressConfirmation";

export function LocationSheet() {
  const { setIsSheetOpen, setSelectedLocation } = useLocation();
  const [step, setStep] = useState<"list" | "confirm">("list");
  const [pendingLocation, setPendingLocation] = useState<Location | null>(null);

  const handleSelect = (location: Location) => {
    setPendingLocation(location);
    setStep("confirm");
  };

  const handleConfirm = () => {
    if (pendingLocation) {
      setSelectedLocation(pendingLocation);
    }
    setIsSheetOpen(false);
  };

  const handleCancel = () => {
    setStep("list");
    setPendingLocation(null);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsSheetOpen(false)}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-gray-300" aria-hidden="true" />
        <div className="px-4 pb-8 pt-2 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Select Location</h2>
            <button
              type="button"
              onClick={() => setIsSheetOpen(false)}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {step === "list" ? (
            <div className="space-y-5">
              <CurrentLocationCard onSelect={handleSelect} />
              <AddressSearch onSelect={handleSelect} />
              <SavedAddresses onSelect={handleSelect} />
            </div>
          ) : (
            <AddressConfirmation
              location={pendingLocation!}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
}
