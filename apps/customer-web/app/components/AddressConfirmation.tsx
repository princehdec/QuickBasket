"use client";

import { MapPin } from "lucide-react";
import type { Location } from "../context/LocationContext";
import { Button } from "./ui/Button";

export function AddressConfirmation({
  location,
  onCancel,
  onConfirm,
}: {
  location: Location;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="py-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <MapPin size={28} />
        </span>
        <div>
          <p className="text-base font-semibold text-gray-900">Confirm delivery to</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            {location.label ? `${location.label} — ` : ""}
            {location.address}, {location.city}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="tertiary" size="lg" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="lg" className="flex-1" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
