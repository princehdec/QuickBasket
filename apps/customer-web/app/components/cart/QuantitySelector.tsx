"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  size = "md",
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
}) {
  const btnClass =
    size === "sm"
      ? "h-7 w-7"
      : "h-8 w-8";
  const textClass = size === "sm" ? "text-xs" : "text-sm";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <div className="inline-flex items-center gap-0 rounded-button border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={`flex ${btnClass} items-center justify-center rounded-l-button text-gray-600 transition-colors hover:bg-gray-100`}
      >
        <Minus size={iconSize} />
      </button>
      <span
        className={`flex ${btnClass} items-center justify-center font-semibold text-gray-900 ${textClass}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={`flex ${btnClass} items-center justify-center rounded-r-button text-gray-600 transition-colors hover:bg-gray-100`}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
