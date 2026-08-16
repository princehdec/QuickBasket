"use client";

import { useState } from "react";
import { NotebookText } from "lucide-react";
import { khataInputClass } from "../ui";

interface PhoneEntryProps {
  onNext: (phone: string) => void;
}

export function PhoneEntry({ onNext }: PhoneEntryProps) {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      onNext(phone);
    }
  };

  return (
    <div className="hero-wash flex flex-col items-center justify-center px-4 py-12 min-h-[80vh]">
      <div className="w-full max-w-md animate-slide-up rounded-card border border-paper-200/70 bg-surface p-6 shadow-soft sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-khata-500 to-khata-700 text-khata-50 shadow-[0_6px_18px_-4px_rgb(115_38_29/0.55)] ring-1 ring-inset ring-white/20">
            <NotebookText size={30} aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">
            QuickBasket Khata
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Enter your phone number to access your neighborhood credit ledger
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-display text-sm font-bold text-gray-900" htmlFor="khata-phone">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-sm font-bold tabular-nums text-gray-700">
                +91
              </span>
              <input
                id="khata-phone"
                type="tel"
                placeholder="Enter 10 digit number"
                className={`${khataInputClass} pl-12 font-display font-semibold tabular-nums`}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-button bg-khata-600 font-display text-base font-bold text-khata-50 shadow-[0_4px_14px_-4px_rgb(115_38_29/0.55)] transition-all duration-200 hover:bg-khata-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
            disabled={phone.length !== 10}
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
          By continuing, you agree to QuickBasket&apos;s Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
