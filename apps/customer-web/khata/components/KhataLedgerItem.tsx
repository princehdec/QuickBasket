"use client";

import { KhataEntry } from "@quickbasket/types";
import { cn } from "@quickbasket/ui";

interface KhataLedgerItemProps {
  entry: KhataEntry;
  isCustomerView?: boolean;
  className?: string;
}

/* One ruled ledger row: red rail for purchases (credit taken),
   green rail for repayments (credit settled), turmeric when pending. */
export function KhataLedgerItem({
  entry,
  isCustomerView = true,
  className,
}: KhataLedgerItemProps) {
  const isPurchase = entry.type === "purchase";
  const isRepayment = entry.type === "repayment";
  const isPending = entry.status === "pending";
  const isApproved = entry.status === "approved";
  const isRejected = entry.status === "rejected";

  // Determine amount display based on type and perspective
  const amountDisplay = isCustomerView
    ? isPurchase
      ? `+ ₹${entry.amount.toFixed(2)}`
      : `- ₹${entry.amount.toFixed(2)}`
    : isPurchase
    ? `- ₹${entry.amount.toFixed(2)}`
    : `+ ₹${entry.amount.toFixed(2)}`;

  // Determine status color
  const statusColor = isApproved
    ? "text-brand-700"
    : isRejected
    ? "text-error"
    : "text-turmeric-600";

  return (
    <div
      className={cn(
        "ruled-paper flex items-center justify-between border-b border-paper-200/70 px-4 py-3.5 last:border-b-0",
        "relative pl-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-1 before:rounded-full",
        isPurchase && "before:bg-khata-500",
        isRepayment && "before:bg-brand-500",
        isPending && "opacity-75",
        className
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold text-gray-900">
            {isPurchase ? "Purchase" : "Repayment"}
          </span>
          {isPending && (
            <span className="rounded-full bg-turmeric-100 px-2 py-0.5 text-xs font-bold text-turmeric-700">
              Pending
            </span>
          )}
          {isRejected && (
            <span className="rounded-full bg-khata-100 px-2 py-0.5 text-xs font-bold text-khata-700">
              Rejected
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs tabular-nums text-gray-600">
          {new Date(entry.date).toLocaleString("en-IN", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
        {entry.description && (
          <div className="mt-1 text-xs text-gray-600">{entry.description}</div>
        )}
      </div>
      <div className={cn("font-display text-sm font-bold tabular-nums", statusColor)}>
        {amountDisplay}
      </div>
    </div>
  );
}
