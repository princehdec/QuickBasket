"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "../../../lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-card ring-1 ring-inset ring-paper-900/5">
        <div
          className={cn(
            "flex h-80 items-center justify-center rounded-card bg-gradient-to-br sm:h-96",
            images[selected]
          )}
          aria-label={name}
        />
        <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-gray-600 backdrop-blur transition-opacity group-hover:opacity-100 sm:opacity-0">
          <ZoomIn size={16} />
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-background transition-all",
                selected === i
                  ? "ring-brand-600"
                  : "ring-transparent opacity-60 hover:opacity-100"
              )}
            >
              <div
                className={cn("h-full w-full rounded-xl bg-gradient-to-br", img)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
