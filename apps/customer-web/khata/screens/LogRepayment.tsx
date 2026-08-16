"use client";

import { useState } from "react";
import { LogRepaymentInput } from "@quickbasket/types";
import { KhataHeader, InitialTile, khataInputClass } from "../ui";
import { Calendar, IndianRupee } from "lucide-react";

interface LogRepaymentProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    balance: number;
  };
  onBack: () => void;
  onSubmit: (data: LogRepaymentInput) => void;
}

export function LogRepayment({ customer, onBack, onSubmit }: LogRepaymentProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "bank_transfer">("cash");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const repaymentAmount = parseFloat(amount);
    if (repaymentAmount <= 0 || repaymentAmount > customer.balance) return;

    setIsSubmitting(true);
    const repaymentData: LogRepaymentInput = {
      shopId: "shop1", // This would come from auth context
      customerId: customer.id,
      amount: repaymentAmount,
      description: note || `Repayment via ${paymentMethod}`,
      date: new Date().toISOString(),
      paymentMethod
    };
    onSubmit(repaymentData);
  };

  return (
    <div className="min-h-screen bg-background">
      <KhataHeader title="Log Repayment" onBack={onBack}>
        <div className="mt-4 flex items-center gap-3">
          <InitialTile name={customer.name} />
          <div>
            <h3 className="font-display text-sm font-bold text-gray-900">{customer.name}</h3>
            <p className="text-sm tabular-nums text-gray-600">{customer.phone}</p>
            <p className="text-sm font-bold tabular-nums text-khata-600">
              ₹{customer.balance.toFixed(2)} due
            </p>
          </div>
        </div>
      </KhataHeader>

      <div className="max-w-lg px-4 py-4">
        <form onSubmit={handleSubmit} className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft sm:p-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="repayment-amount" className="mb-1 block font-display text-sm font-bold text-gray-900">
                Repayment Amount
              </label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400" aria-hidden="true" />
                <input
                  id="repayment-amount"
                  type="number"
                  placeholder="0.00"
                  className={`${khataInputClass} pl-9 font-display font-semibold tabular-nums`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                  max={customer.balance}
                  step="0.01"
                />
              </div>
              <p className="mt-1 text-xs tabular-nums text-gray-500">
                Maximum: ₹{customer.balance.toFixed(2)}
              </p>
            </div>

            <div>
              <label htmlFor="repayment-method" className="mb-1 block font-display text-sm font-bold text-gray-900">
                Payment Method
              </label>
              <select
                id="repayment-method"
                className={`${khataInputClass} cursor-pointer appearance-none`}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as "cash" | "upi" | "bank_transfer")}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label htmlFor="repayment-note" className="mb-1 block font-display text-sm font-bold text-gray-900">
                Add a note (optional)
              </label>
              <textarea
                id="repayment-note"
                placeholder="e.g., Received partial payment"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${khataInputClass} min-h-[60px] resize-none py-3`}
              />
            </div>

            <div className="flex items-center gap-2 text-sm tabular-nums text-gray-600">
              <Calendar size={14} className="text-paper-500" aria-hidden="true" />
              <span>
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex h-14 w-full items-center justify-center rounded-button bg-brand-600 font-display text-base font-bold text-paper-50 shadow-[0_4px_16px_-4px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
            disabled={parseFloat(amount) <= 0 || parseFloat(amount) > customer.balance || isSubmitting}
          >
            {isSubmitting ? "Logging..." : "Log Repayment"}
          </button>
        </form>
      </div>
    </div>
  );
}
