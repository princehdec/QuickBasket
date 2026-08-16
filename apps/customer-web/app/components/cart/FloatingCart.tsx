"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

export function FloatingCart() {
  const { items, getTotalItems, getSubtotal } = useCart();
  const pathname = usePathname();
  const totalItems = getTotalItems();

  if (totalItems === 0 || pathname === "/cart") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-paper-200/80 bg-surface/95 shadow-bar backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <ShoppingCart size={20} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 font-display text-[10px] font-bold tabular-nums text-paper-50">
              {totalItems}
            </span>
          </span>
          <div className="tabular-nums">
            <p className="font-display text-sm font-bold text-gray-900">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </p>
            <p className="text-xs font-semibold text-gray-600">₹{getSubtotal()}</p>
          </div>
        </div>

        <Link
          href="/cart"
          className="inline-flex h-10 items-center gap-1.5 rounded-button bg-brand-600 px-5 font-display text-sm font-bold text-paper-50 shadow-[0_2px_10px_-2px_rgb(18_50_30/0.45)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.98]"
        >
          View Cart
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
