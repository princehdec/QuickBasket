"use client";

import { KhataEntry } from "@quickbasket/types";
import { cn } from "@quickbasket/ui";

interface KhataLedgerItemProps {
  entry: KhataEntry;
  isCustomerView?: boolean;
  className?: string;
}

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
    ? "text-success"
    : isRejected
    ? "text-error"
    : "text-warning";

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-4 border-b border-neutral-100 last:border-b-0",
        "relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-full",
        isPurchase && "before:bg-primary",
        isRepayment && "before:bg-primary-light",
        isPending && "opacity-70",
        className
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900">
            {isPurchase ? "Purchase" : "Repayment"}
          </span>
          {isPending && (
            <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">
              Pending
            </span>
          )}
          {isRejected && (
            <span className="text-xs px-2 py-0.5 bg-error/10 text-error rounded-full">
              Rejected
            </span>
          )}
        </div>
        <div className="text-xs text-neutral-600 mt-0.5">
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
          <div className="text-xs text-neutral-600 mt-1">{entry.description}</div>
        )}
      </div>
      <div className={cn("text-sm font-medium", statusColor)}>
        {amountDisplay}
      </div>
    </div>
  );
}