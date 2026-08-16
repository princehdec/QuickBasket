"use client";

import { useState } from "react";
import { KhataRequest } from "@quickbasket/types";
import { KhataLedgerItem } from "../components/KhataLedgerItem";
import { Button, Card, Input } from "@quickbasket/ui";
import { LucideArrowLeft, LucideCalendar, LucidePhone, LucideUser } from "lucide-react";

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
    <div className="min-h-screen bg-neutral-100">
      <div className="sticky top-0 bg-white z-10 py-4 px-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack ?? (() => window.history.back())}>
            <LucideArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-neutral-900">Review Khata Request</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <LucideUser className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">{mockRequest.customerName}</h3>
              <p className="text-sm text-neutral-600">{mockRequest.customerPhone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <LucidePhone className="w-4 h-4 text-neutral-600" />
              <span className="text-neutral-900">{mockRequest.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <LucideCalendar className="w-4 h-4 text-neutral-600" />
              <span className="text-neutral-900">
                Requested on {new Date(mockRequest.requestedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Recent Activity</h4>
            <div className="space-y-3">
              {mockRecentActivity.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-neutral-900">{entry.description}</p>
                    <p className="text-xs text-neutral-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-medium">₹{entry.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Add a note (optional)
            </label>
            <Input
              placeholder="e.g., Known customer, good credit history"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px] align-top"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReject}
              disabled={isApproving || isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              className="flex-1"
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
            >
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}