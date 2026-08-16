"use client";

import { useState } from "react";
import { LogPurchaseInput } from "@quickbasket/types";
import { KhataHeader, InitialTile, khataInputClass } from "../ui";
import { Calendar, IndianRupee, Plus, Trash2 } from "lucide-react";

interface LogPurchaseProps {
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  onBack: () => void;
  onSubmit: (data: LogPurchaseInput) => void;
}

export function LogPurchase({ customer, onBack, onSubmit }: LogPurchaseProps) {
  const [items, setItems] = useState<{ name: string; amount: string }[]>([
    { name: "", amount: "" }
  ]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { name: "", amount: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: "name" | "amount", value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmount <= 0) return;

    setIsSubmitting(true);
    const purchaseData: LogPurchaseInput = {
      shopId: "shop1", // This would come from auth context
      customerId: customer.id,
      amount: totalAmount,
      description: items.length === 1
        ? items[0].name
        : `${items[0].name} + ${items.length - 1} more`,
      date: new Date().toISOString()
    };
    onSubmit(purchaseData);
  };

  return (
    <div className="min-h-screen bg-background">
      <KhataHeader title="Log Purchase" onBack={onBack}>
        <div className="mt-4 flex items-center gap-3">
          <InitialTile name={customer.name} />
          <div>
            <h3 className="font-display text-sm font-bold text-gray-900">{customer.name}</h3>
            <p className="text-sm tabular-nums text-gray-600">{customer.phone}</p>
          </div>
        </div>
      </KhataHeader>

      <div className="max-w-lg px-4 py-4">
        <form onSubmit={handleSubmit} className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft sm:p-5">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="mb-1 block font-display text-xs font-bold uppercase tracking-wide text-gray-600">
                    Item {index + 1}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rice, Dal"
                    className={khataInputClass}
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block font-display text-xs font-bold uppercase tracking-wide text-gray-600">
                    Amount
                  </label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-400" aria-hidden="true" />
                    <input
                      type="number"
                      placeholder="0.00"
                      className={`${khataInputClass} pl-8 font-display font-semibold tabular-nums`}
                      value={item.amount}
                      onChange={(e) => updateItem(index, "amount", e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 1}
                  aria-label={`Remove item ${index + 1}`}
                  className="flex h-12 w-10 shrink-0 items-center justify-center rounded-button text-paper-400 transition-colors hover:bg-khata-100 hover:text-khata-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-button border border-dashed border-paper-300 font-display text-sm font-bold text-gray-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
              onClick={addItem}
            >
              <Plus size={15} aria-hidden="true" />
              Add another item
            </button>
          </div>

          <div className="mt-6 border-t border-paper-200/70 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-gray-900">Total</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-khata-600">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            <label htmlFor="purchase-note" className="mb-2 block font-display text-sm font-bold text-gray-900">
              Add a note (optional)
            </label>
            <textarea
              id="purchase-note"
              placeholder="e.g., Paid partially in cash"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${khataInputClass} min-h-[60px] resize-none py-3`}
            />

            <div className="mt-4 flex items-center gap-2 text-sm tabular-nums text-gray-600">
              <Calendar size={14} className="text-paper-500" aria-hidden="true" />
              <span>
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex h-14 w-full items-center justify-center rounded-button bg-khata-600 font-display text-base font-bold text-khata-50 shadow-[0_4px_16px_-4px_rgb(115_38_29/0.55)] transition-all duration-200 hover:bg-khata-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
            disabled={totalAmount <= 0 || isSubmitting}
          >
            {isSubmitting ? "Logging..." : "Log Purchase"}
          </button>
        </form>
      </div>
    </div>
  );
}
