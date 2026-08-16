"use client";

import { useState } from "react";
import { KhataEntry, LinkedShop } from "@quickbasket/types";
import { KhataLedgerItem } from "../components/KhataLedgerItem";
import { KhataHeader } from "../ui";
import { Calendar, Phone, Search, Store } from "lucide-react";

const mockShop: LinkedShop = {
  id: "shop1",
  name: "Raj Kirana Store",
  ownerId: "owner1",
  khataBalance: 850.50,
  lastActivity: "2026-08-15T10:30:00Z",
  phoneNumber: "9876543210",
  address: "123 Main Street, Near City Park, Mumbai"
};

const mockEntries: KhataEntry[] = [
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
    amount: 200.00,
    date: "2026-08-14T16:20:00Z",
    type: "repayment",
    status: "approved",
    description: "Partial payment"
  },
  {
    id: "3",
    shopId: "shop1",
    customerId: "customer1",
    amount: 350.00,
    date: "2026-08-13T09:15:00Z",
    type: "purchase",
    status: "pending",
    description: "Vegetables - Potatoes, Onions"
  }
];

export function KhataDetailsCustomer() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = mockEntries.filter(entry =>
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.amount.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <KhataHeader title={mockShop.name} onBack={() => window.history.back()}>
        <div className="mt-4 flex items-center justify-between rounded-card bg-gradient-to-br from-khata-500 via-khata-600 to-khata-700 p-4 text-khata-50 shadow-[0_6px_18px_-6px_rgb(115_38_29/0.55)]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-khata-100/90">
              You owe
            </p>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <Store size={16} className="self-center text-khata-100" aria-hidden="true" />
              <span className="font-display text-2xl font-extrabold tracking-tight tabular-nums">
                ₹{mockShop.khataBalance.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-khata-100/90">due</span>
            </div>
          </div>
          <button
            type="button"
            className="flex h-9 items-center rounded-button bg-khata-50 px-4 font-display text-sm font-bold text-khata-700 shadow-sm transition-all duration-150 hover:bg-white active:scale-95"
          >
            Pay Now
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm tabular-nums">
          <div className="flex items-center gap-2 text-gray-700">
            <Phone size={14} className="text-paper-500" aria-hidden="true" />
            <span>{mockShop.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={14} className="text-paper-500" aria-hidden="true" />
            <span>Since Jan 2025</span>
          </div>
        </div>
      </KhataHeader>

      <div className="px-4 py-4">
        <div className="relative mb-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            className="h-11 w-full rounded-full border border-paper-300 bg-paper-50 pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-paper-400 transition-colors focus:border-khata-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-khata-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="stagger overflow-hidden rounded-card border border-paper-200/70 bg-surface shadow-soft">
          {filteredEntries.map((entry) => (
            <KhataLedgerItem key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
