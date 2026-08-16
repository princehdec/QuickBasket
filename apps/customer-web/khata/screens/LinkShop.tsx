"use client";

import { useState } from "react";
import { Store, UserPlus } from "lucide-react";
import { khataInputClass } from "../ui";

interface LinkShopProps {
  onRequestKhata: (shopPhone: string) => void;
  onBack: () => void;
}

export function LinkShop({ onRequestKhata, onBack }: LinkShopProps) {
  const [shopPhone, setShopPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shopPhone.length === 10) {
      setIsSubmitting(true);
      onRequestKhata(shopPhone);
    }
  };

  return (
    <div className="hero-wash flex flex-col items-center justify-center px-4 py-12 min-h-[80vh]">
      <div className="w-full max-w-md animate-slide-up rounded-card border border-paper-200/70 bg-surface p-6 shadow-soft sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-khata-100 text-khata-700">
            <Store size={28} aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">Link a Shop</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Enter the shop's phone number to request khata access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-display text-sm font-bold text-gray-900" htmlFor="link-shop-phone">
              Shop Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-sm font-bold tabular-nums text-gray-700">
                +91
              </span>
              <input
                id="link-shop-phone"
                type="tel"
                placeholder="Enter 10 digit number"
                className={`${khataInputClass} pl-12 font-display font-semibold tabular-nums`}
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center rounded-button border border-paper-300 bg-surface font-display text-sm font-bold text-gray-800 transition-all duration-200 hover:border-paper-400 hover:bg-paper-50 active:scale-[0.98]"
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="submit"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-button bg-khata-600 font-display text-sm font-bold text-khata-50 shadow-[0_4px_14px_-4px_rgb(115_38_29/0.55)] transition-all duration-200 hover:bg-khata-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              disabled={shopPhone.length !== 10 || isSubmitting}
            >
              <UserPlus size={15} aria-hidden="true" />
              {isSubmitting ? "Sending..." : "Request Khata"}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-paper-200/70 pt-4">
          <h3 className="font-display text-sm font-bold text-gray-900">How it works</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="font-display font-bold text-khata-600">1.</span>
              <span>Enter the shop's phone number</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-display font-bold text-khata-600">2.</span>
              <span>The shop owner will receive your request</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-display font-bold text-khata-600">3.</span>
              <span>Once approved, you can start using khata</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
