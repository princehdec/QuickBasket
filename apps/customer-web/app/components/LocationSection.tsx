"use client";

import { ChevronDown, MapPin, Navigation } from "lucide-react";
import { Container, Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { useLocation } from "../context/LocationContext";

export function LocationSection() {
  const { selectedLocation, setIsSheetOpen } = useLocation();

  return (
    <Section className="pt-4 pb-2 sm:pt-5 sm:pb-3">
      <Container>
        <div
          className="flex flex-col gap-3 rounded-card border border-paper-200/80 bg-surface
                     p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4
                     hover:shadow-lift transition-all duration-200"
        >
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="flex flex-1 items-center gap-3.5 rounded-button
                       text-left transition-colors hover:bg-paper-100/60 -m-2 p-2"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center
                         rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-paper-50
                         shadow-[0_3px_10px_-2px_rgb(18_50_30/0.4)]"
              aria-hidden="true"
            >
              <MapPin size={20} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-paper-500">
                Deliver to
              </p>
              {selectedLocation ? (
                <>
                  <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                    {selectedLocation.label}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {selectedLocation.address}, {selectedLocation.city}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                    Current Location
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    Select your address to see nearby stores
                  </p>
                </>
              )}
            </div>

            <ChevronDown
              size={18}
              className="shrink-0 text-paper-400"
              aria-hidden="true"
            />
          </button>

          <span className="hidden h-10 w-px bg-paper-200 sm:block" aria-hidden="true" />

          {selectedLocation ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              className="self-start sm:self-center gap-2"
              onClick={() => setIsSheetOpen(true)}
            >
              <Navigation size={16} aria-hidden="true" />
              Change
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="md"
              className="self-start sm:self-center gap-2"
              onClick={() => setIsSheetOpen(true)}
            >
              <Navigation size={16} aria-hidden="true" />
              Set Address
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}
