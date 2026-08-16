"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Order } from "../../../lib/mock/orders";

const statusStyles: Record<string, string> = {
  active: "bg-info/10 text-info",
  completed: "bg-brand-100 text-brand-800",
  cancelled: "bg-khata-100 text-khata-700",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  completed: "Delivered",
  cancelled: "Cancelled",
};

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${order.storeLogoGradient} shadow-sm`}
            aria-hidden="true"
          >
            <ShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{order.orderDate}</p>
            <h3 className="text-sm font-semibold text-gray-900">{order.storeName}</h3>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
            statusStyles[order.status]
          )}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm tabular-nums text-gray-600">
        <span>{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
        <span className="font-display font-bold text-gray-900">₹{order.grandTotal}</span>
        <span className="text-xs">ID: {order.id}</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-paper-200/80 pt-3">
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
        >
          View Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
