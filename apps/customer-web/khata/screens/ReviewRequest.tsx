"use client";

import { useState } from "react";
import { Calendar, Phone } from "lucide-react";
import { KhataRequest } from "@quickbasket/types";
import { KhataHeader, InitialTile, khataInputClass } from "../ui";

const mockRequest: KhataRequest = {
  id: "req1",
  shopId: "shop1",
  customerId: "customer1",
  customerName: "Amit Sharma",
  customerPhone: "9876543210",
  status: "pending",
  requestedAt: "2026-08-15T14:20:00Z"
};

const mockRecentActivity = [
  {
    id: "1",
    shopId: "shop1",
    customerId: "customer1",
    amount: 500.50,
    date: "2026-08-15T10:30:00Z",
    type: "purchase",
    status: "approved",
    description: "Groceries - Rice, Dal, Oil"
  },
  {
    id: "2",
    shopId: "shop1",
    customerId: "customer1",
    amount: 350.00,
    date: "2026-08-13T09:15:00Z",
    type: "purchase",
    status: "approved",
    description: "Vegetables - Potatoes, Onions"
  }
];

interface ReviewRequestProps {
  onBack?: () => void;
}

export function ReviewRequest({ onBack }: ReviewRequestProps) {
  const [note, setNote] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = () => {
    setIsApproving(true);
    // Simulate API call
    setTimeout(() => {
      setIsApproving(false);
      // Redirect or show success
    }, 1500);
  };

  const handleReject = () => {
    setIsRejecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false);
      // Redirect or show success
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <KhataHeader
        title="Review Khata Request"
        onBack={onBack ?? (() => window.history.back())}
      />

      <div className="max-w-lg space-y-4 px-4 py-4">
        <div className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft sm:p-5">
          <div className="flex items-center gap-3">
            <InitialTile name={mockRequest.customerName} className="h-12 w-12 text-lg" />
            <div>
              <h3 className="font-display text-base font-bold text-gray-900">
                {mockRequest.customerName}
              </h3>
              <p className="text-sm tabular-nums text-gray-600">{mockRequest.customerPhone}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm tabular-nums">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone size={14} className="shrink-0 text-paper-500" aria-hidden="true" />
              <span>{mockRequest.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={14} className="shrink-0 text-paper-500" aria-hidden="true" />
              <span>Requested on {new Date(mockRequest.requestedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="font-display text-sm font-bold text-gray-900">Recent Activity</h4>
            <div className="ruled-paper mt-2 space-y-3 rounded-xl border border-paper-200/70 p-3">
              {mockRecentActivity.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{entry.description}</p>
                    <p className="text-xs tabular-nums text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-display font-bold tabular-nums text-gray-900">
                    ₹{entry.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-paper-200/70 pt-4">
            <label htmlFor="review-note" className="mb-2 block font-display text-sm font-bold text-gray-900">
              Add a note (optional)
            </label>
            <textarea
              id="review-note"
              placeholder="e.g., Known customer, good credit history"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${khataInputClass} min-h-[80px] resize-none py-3`}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center rounded-button border border-khata-200 bg-khata-50 font-display text-sm font-bold text-khata-700 transition-all duration-200 hover:border-khata-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              onClick={handleReject}
              disabled={isApproving || isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </button>
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center rounded-button bg-brand-600 font-display text-sm font-bold text-paper-50 shadow-[0_3px_12px_-3px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
            >
              {isApproving ? "Approving..." : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
