"use client";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
      <div className="mt-1.5 flex">
        <span className="inline-flex h-12 items-center rounded-l-button border border-r-0 border-gray-200 bg-gray-50 px-3.5 text-sm font-medium text-gray-600">
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
          className="h-12 w-full rounded-r-button border border-gray-200 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
