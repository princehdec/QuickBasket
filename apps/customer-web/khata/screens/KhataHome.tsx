"use client";

import { useState } from "react";
import { KhataSummary, LinkedShop } from "@quickbasket/types";
import { KhataSummaryCard } from "../components/KhataSummaryCard";
import { KhataLedgerItem } from "../components/KhataLedgerItem";
import { KhataTabs, InitialTile } from "../ui";
import { cn } from "@quickbasket/ui";
import { Search, Store, UserPlus } from "lucide-react";

const mockSummary: KhataSummary = {
  totalBalance: 1250.75,
  shopsCount: 3,
  recentActivity: [
    {
      id: "1",
      shopId: "shop1",
      customerId: "customer1",
      amount: 500.50,
      date: "2026-08-15T10:30:00Z",
      type: "purchase",
      status: "approved"
    },
    {
      id: "2",
      shopId: "shop2",
      customerId: "customer1",
      amount: 200.25,
      date: "2026-08-14T15:45:00Z",
      type: "repayment",
      status: "approved"
    },
    {
      id: "3",
      shopId: "shop1",
      customerId: "customer1",
      amount: 350.00,
      date: "2026-08-13T09:15:00Z",
      type: "purchase",
      status: "pending"
    }
  ],
  pendingRequests: 1
};

const mockShops: LinkedShop[] = [
  {
    id: "shop1",
    name: "Raj Kirana Store",
    ownerId: "owner1",
    khataBalance: 850.50,
    lastActivity: "2026-08-15T10:30:00Z",
    phoneNumber: "9876543210"
  },
  {
    id: "shop2",
    name: "Neha General Store",
    ownerId: "owner2",
    khataBalance: 400.25,
    lastActivity: "2026-08-14T15:45:00Z",
    phoneNumber: "9876543211"
  },
  {
    id: "shop3",
    name: "Sunil Provisions",
    ownerId: "owner3",
    khataBalance: 0,
    lastActivity: "2026-08-10T12:00:00Z",
    phoneNumber: "9876543212"
  }
];

interface KhataHomeProps {
  onLinkShop?: () => void;
  onViewShop?: () => void;
  onViewCustomer?: () => void;
}

export function KhataHome({ onLinkShop, onViewShop, onViewCustomer }: KhataHomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"activity" | "shops">("activity");

  const filteredShops = mockShops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-paper-200/80 bg-surface/95 px-4 py-4 shadow-soft backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-khata-600">
              QuickBasket
            </p>
            <h1 className="font-display text-xl font-bold tracking-tight text-gray-900">Khata</h1>
          </div>
        </div>

        <KhataSummaryCard summary={mockSummary} className="mt-4" />

        <div className="mt-5">
          <KhataTabs
            tabs={[
              { id: "activity", label: "Activity" },
              { id: "shops", label: "Shops" },
            ]}
            active={activeTab}
            onChange={(id) => setActiveTab(id as "activity" | "shops")}
          />
        </div>
      </div>

      <div className="px-4 py-4">
        {activeTab === "activity" ? (
          <div className="stagger overflow-hidden rounded-card border border-paper-200/70 bg-surface shadow-soft">
            {mockSummary.recentActivity.map((entry) => (
              <KhataLedgerItem key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search shops..."
                className="h-11 w-full rounded-full border border-paper-300 bg-paper-50 pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-paper-400 transition-colors focus:border-khata-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-khata-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <InitialTile name={shop.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Store size={15} className="shrink-0 text-khata-600" aria-hidden="true" />
                    <h3 className="truncate font-display text-sm font-bold text-gray-900">{shop.name}</h3>
                  </div>
                  <p className={cn(
                    "mt-1 text-sm font-semibold tabular-nums",
                    shop.khataBalance > 0 ? "text-khata-600" : "text-gray-500"
                  )}>
                    {shop.khataBalance > 0 ? `₹${shop.khataBalance.toFixed(2)} due` : "No balance"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={onViewCustomer}
                    className="flex h-8 items-center rounded-button border border-paper-300 px-3 font-display text-xs font-bold text-gray-800 transition-colors hover:border-paper-400 hover:bg-paper-50"
                  >
                    View
                  </button>
                  {shop.khataBalance > 0 && (
                    <button
                      type="button"
                      className="flex h-8 items-center rounded-button bg-khata-600 px-3 font-display text-xs font-bold text-khata-50 shadow-[0_2px_8px_-2px_rgb(115_38_29/0.45)] transition-all duration-150 hover:bg-khata-700 active:scale-95"
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onLinkShop}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-button border border-khata-300 bg-surface font-display text-sm font-bold text-khata-700 transition-colors hover:border-khata-400 hover:bg-khata-50"
            >
              <UserPlus size={16} aria-hidden="true" />
              Link a new shop
            </button>

            {onViewShop && (
              <button
                onClick={onViewShop}
                className="w-full pt-2 text-center text-sm font-bold text-khata-700 transition-colors hover:text-khata-800"
              >
                Are you a shop owner? Manage your khata
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
