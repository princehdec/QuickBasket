"use client";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800">Phone Number</label>
      <div className="mt-1.5 flex">
        <span className="inline-flex h-12 items-center rounded-l-button border border-r-0 border-paper-300 bg-paper-100 px-3.5 font-display text-sm font-bold tabular-nums text-gray-700">
          +91
        </span>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={value}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
            onChange(cleaned);
          }}
          placeholder="Enter phone number"
          className="h-12 w-full rounded-r-button border border-paper-300 bg-surface px-3.5 font-display text-sm font-semibold tabular-nums text-gray-900 placeholder:font-sans placeholder:font-normal placeholder:text-paper-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
