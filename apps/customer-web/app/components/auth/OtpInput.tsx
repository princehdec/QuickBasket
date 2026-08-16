"use client";

import { useCallback, useRef } from "react";
import { cn } from "../../../lib/utils";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, digit: string) => {
      if (!/^\d$/.test(digit) && digit !== "") return;

      const newValue = value.split("");
      newValue[index] = digit;
      const joined = newValue.join("").slice(0, length);
      onChange(joined);

      if (digit && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [value, onChange, length]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [value]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      onChange(pasted);
      const focusIndex = Math.min(pasted.length, length - 1);
      inputsRef.current[focusIndex]?.focus();
    },
    [length, onChange]
  );

  return (
    <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          autoFocus={index === 0}
          className={cn(
            "h-12 w-11 rounded-button border bg-surface text-center font-display text-lg font-bold tabular-nums text-gray-900 transition-all duration-150",
            "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:-translate-y-0.5",
            value[index] ? "border-brand-300 bg-brand-50" : "border-paper-300"
          )}
        />
      ))}
    </div>
  );
}
