"use client";

import { AlertTriangle } from "lucide-react";
import { KhataSummary } from "@quickbasket/types";
import { cn } from "@quickbasket/ui";

interface KhataSummaryCardProps {
  summary: KhataSummary;
  className?: string;
}

/* The bahi-khata "red book" panel — the one deep-red surface in the
   product, reserved for the credit ledger. */
export function KhataSummaryCard({ summary, className }: KhataSummaryCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card bg-gradient-to-br from-khata-500 via-khata-600 to-khata-700 p-5 text-khata-50 shadow-[0_6px_20px_-6px_rgb(115_38_29/0.55)]",
        className
      )}
    >
      <span
        className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-khata-300/25 blur-xl"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-khata-100/90">
            Total Khata Balance
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold tracking-tight tabular-nums">
            ₹{summary.totalBalance.toFixed(2)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-khata-100/90">
            Shops Linked
          </div>
          <div className="mt-1 font-display text-2xl font-extrabold tabular-nums">
            {summary.shopsCount}
          </div>
        </div>
      </div>
      {summary.pendingRequests > 0 && (
        <div className="relative mt-4 border-t border-khata-300/40 pt-3">
          <div className="flex items-center gap-1.5 rounded-full bg-khata-800/40 px-3 py-1 text-xs font-bold text-turmeric-200">
            <AlertTriangle size={13} aria-hidden="true" />
            <span>
              {summary.pendingRequests} pending request
              {summary.pendingRequests > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
