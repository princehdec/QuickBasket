"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

export function ProductDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Description</h2>
      <div className="relative mt-2">
        <p
          className={cn(
            "text-sm leading-relaxed text-gray-700",
            !expanded && "line-clamp-3"
          )}
        >
          {description}
        </p>
        {description.length > 150 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
          >
            {expanded ? "Show Less" : "Read More"}
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform",
                expanded && "rotate-180"
              )}
            />
          </button>
        )}
      </div>
    </section>
  );
}
