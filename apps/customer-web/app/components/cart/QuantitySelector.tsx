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
    <div className="inline-flex select-none items-center rounded-button bg-brand-600 text-paper-50 shadow-[0_2px_8px_-2px_rgb(18_50_30/0.45)]">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={`flex ${btnClass} items-center justify-center rounded-l-button transition-colors hover:bg-brand-700 active:scale-90`}
      >
        <Minus size={iconSize} />
      </button>
      <span
        className={`flex min-w-6 items-center justify-center font-display font-bold tabular-nums text-paper-50 ${textClass}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={`flex ${btnClass} items-center justify-center rounded-r-button transition-colors hover:bg-brand-700 active:scale-90`}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
