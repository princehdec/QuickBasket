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
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <ShoppingCart size={20} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </p>
            <p className="text-xs text-gray-500">₹{getSubtotal()}</p>
          </div>
        </div>

        <Link
          href="/cart"
          className="inline-flex h-10 items-center gap-1.5 rounded-button bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/20 transition-colors hover:bg-brand-600"
        >
          View Cart
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
