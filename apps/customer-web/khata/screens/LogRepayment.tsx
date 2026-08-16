"use client";

import { useState } from "react";
import { LogRepaymentInput } from "@quickbasket/types";
import { Button, Card, Input } from "@quickbasket/ui";
import { LucideArrowLeft, LucideCalendar, LucideIndianRupee } from "lucide-react";

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
    <div className="min-h-screen bg-neutral-100">
      <div className="sticky top-0 bg-white z-10 py-4 px-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <LucideArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-neutral-900">Log Repayment</h1>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
            <span className="text-primary font-medium">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">{customer.name}</h3>
            <p className="text-sm text-neutral-600">{customer.phone}</p>
            <p className="text-sm text-error">
              ₹{customer.balance.toFixed(2)} due
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Card className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-900 block mb-1">
                  Repayment Amount
                </label>
                <div className="relative">
                  <LucideIndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                    max={customer.balance}
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Maximum: ₹{customer.balance.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-900 block mb-1">
                  Payment Method
                </label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as "cash" | "upi" | "bank_transfer")}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-900 block mb-1">
                  Add a note (optional)
                </label>
                <Input
                  placeholder="e.g., Received partial payment"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[60px] align-top"
                />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <LucideCalendar className="w-4 h-4 text-neutral-600" />
                <span className="text-neutral-600">
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 py-6 text-lg"
              disabled={parseFloat(amount) <= 0 || parseFloat(amount) > customer.balance || isSubmitting}
            >
              {isSubmitting ? "Logging..." : "Log Repayment"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}