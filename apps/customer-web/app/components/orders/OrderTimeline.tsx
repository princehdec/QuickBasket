"use client";

import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  timelineLabels,
  timelineStepOrder,
  type TimelineStep,
} from "../../../lib/mock/orders";

export function OrderTimeline({
  currentStep,
}: {
  currentStep: TimelineStep;
}) {
  const currentIndex = timelineStepOrder.indexOf(currentStep);
  const isCancelled = currentStep === "placed" && false;

  return (
    <div className="space-y-0">
      {timelineStepOrder.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture = i > currentIndex;

        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-display text-xs font-bold transition-colors",
                  isCompleted && "border-brand-500 bg-brand-500 text-paper-50",
                  isCurrent && !isCancelled && "border-brand-600 bg-brand-600 text-paper-50 ring-4 ring-brand-100",
                  isFuture && "border-paper-300 bg-surface text-paper-400",
                  isCancelled && i === 0 && "border-khata-500 bg-khata-50 text-khata-600"
                )}
              >
                {isCompleted || (isCancelled && i === 0) ? (
                  <Check size={13} />
                ) : (
                  i + 1
                )}
              </span>
              {i < timelineStepOrder.length - 1 && (
                <div
                  className={cn(
                    "mt-1 h-8 w-0.5",
                    isCompleted ? "bg-brand-300" : "bg-paper-200"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-gray-500 line-through",
                  isCurrent && "font-bold text-brand-800",
                  isFuture && "text-paper-400",
                  isCancelled && i === 0 && "text-khata-600"
                )}
              >
                {timelineLabels[step]}
              </p>
              {isCurrent && (
                <p className="mt-0.5 text-xs font-semibold text-gray-500">Current</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
