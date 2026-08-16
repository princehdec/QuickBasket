"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  onBack,
}: {
  value: string;
  onChange: (value: string) => void;
  onBack?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (val: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(val);
      }, 300);
    },
    [onChange]
  );

  const handleChange = (val: string) => {
    setLocal(val);
    debouncedOnChange(val);
  };

  const handleClear = () => {
    setLocal("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="sticky top-0 z-30 border-b border-paper-200/80 bg-surface/90 backdrop-blur-md shadow-soft">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-paper-200/70"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={local}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search for groceries, stores..."
            aria-label="Search"
            className="h-11 w-full rounded-full border border-paper-300 bg-paper-50 pl-10 pr-10 text-sm text-gray-900 placeholder:text-paper-400 transition-colors focus:border-brand-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {local && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-paper-400 transition-colors hover:bg-paper-200 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
