"use client";

import { useState } from "react";
import { KhataSummary, LinkedShop } from "@quickbasket/types";
import { KhataSummaryCard } from "../components/KhataSummaryCard";
import { KhataLedgerItem } from "../components/KhataLedgerItem";
import { Button, Card, Input } from "@quickbasket/ui";
import { LucideSearch, LucideStore, LucideUserPlus } from "lucide-react";

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
    <div className="min-h-screen bg-neutral-100">
      <div className="sticky top-0 bg-white z-10 py-4 px-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-neutral-900">QuickBasket Khata</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <LucideSearch className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <KhataSummaryCard summary={mockSummary} className="mt-4" />

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === "activity" ? "text-primary border-b-2 border-primary" : "text-neutral-600"}`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab("shops")}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === "shops" ? "text-primary border-b-2 border-primary" : "text-neutral-600"}`}
          >
            Shops
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {activeTab === "activity" ? (
          <div className="space-y-4">
            {mockSummary.recentActivity.map((entry) => (
              <KhataLedgerItem key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4" />
              <Input
                placeholder="Search shops..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredShops.map((shop) => (
              <Card key={shop.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <LucideStore className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-neutral-900">{shop.name}</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">
                      {shop.khataBalance > 0 ? `₹${shop.khataBalance.toFixed(2)} due` : "No balance"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onViewCustomer}>
                      View
                    </Button>
                    {shop.khataBalance > 0 && (
                      <Button size="sm">Pay</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <Button className="w-full mt-4" variant="outline" onClick={onLinkShop}>
              <LucideUserPlus className="w-4 h-4 mr-2" />
              Link a new shop
            </Button>

            {onViewShop && (
              <button
                onClick={onViewShop}
                className="w-full text-center text-sm text-primary font-medium pt-2"
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