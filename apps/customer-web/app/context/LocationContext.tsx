"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { LocationSheet } from "../components/LocationSheet";

export type Location = {
  id: string;
  label: string;
  address: string;
  city: string;
  pincode?: string;
};

type LocationContextType = {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <LocationContext.Provider
      value={{ selectedLocation, setSelectedLocation, isSheetOpen, setIsSheetOpen }}
    >
      {children}
      {isSheetOpen && <LocationSheet />}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}
