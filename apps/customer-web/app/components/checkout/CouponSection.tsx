"use client";

import { useState } from "react";
import { Tag, X, Check, Percent, DollarSign, Truck } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  useCheckout,
  validCoupons,
} from "../../contexts/CheckoutContext";

const couponIcons: Record<string, typeof Percent> = {
  WELCOME20: Percent,
  SAVE50: DollarSign,
  FREEDELIVERY: Truck,
};

export function CouponSection() {
  const { couponCode, couponError, couponApplied, applyCoupon, removeCoupon } = useCheckout();
  const [inputValue, setInputValue] = useState("");

  const handleApply = () => {
    applyCoupon(inputValue);
  };

  const handleRemove = () => {
    removeCoupon();
    setInputValue("");
  };

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Coupon</h2>

      {couponApplied ? (
        <div className="mt-2 flex items-center justify-between rounded-card border border-brand-200 bg-brand-50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-200 text-brand-800">
              <Check size={14} />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-800">
                {couponCode} Applied
              </p>
              <p className="text-xs text-brand-700">
                {validCoupons.find((c) => c.code === couponCode)?.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove coupon"
            className="flex h-7 w-7 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-200"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-400"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApply();
                }}
                placeholder="Enter coupon code"
                className="h-11 w-full rounded-button border border-paper-300 bg-paper-50 pl-9 pr-3 text-sm font-semibold tracking-wide text-gray-900 placeholder:font-normal placeholder:text-paper-400 transition-colors focus:border-brand-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={!inputValue.trim()}
              className="flex h-11 shrink-0 items-center rounded-button bg-brand-600 px-5 font-display text-sm font-bold text-paper-50 shadow-[0_2px_10px_-2px_rgb(18_50_30/0.45)] transition-all duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          </div>

          {couponError && (
            <p className="text-sm font-medium text-error">{couponError}</p>
          )}

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Available coupons</p>
            {validCoupons.map((c) => {
              const Icon = couponIcons[c.code] ?? Tag;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setInputValue(c.code);
                    applyCoupon(c.code);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border bg-surface px-3 py-2.5 text-left shadow-soft transition-all hover:-translate-y-px",
                    couponCode === c.code
                      ? "border-brand-300 bg-brand-50"
                      : "border-paper-200/70 hover:border-paper-300"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-turmeric-100 text-turmeric-700">
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {c.label}
                    </span>
                    <p className="text-xs text-gray-600">{c.description}</p>
                  </div>
                  <Tag size={14} className="shrink-0 text-turmeric-400" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
