"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "../../lib/utils";
import { orders, type OrderStatus } from "../../lib/mock/orders";
import { OrderCard } from "../components/orders/OrderCard";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

const tabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-paper-200/80 bg-surface/90 backdrop-blur-md shadow-soft">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-base font-bold tracking-tight text-gray-900">My Orders</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-paper-200/80 bg-surface">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6 lg:px-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-3 font-display text-sm font-bold transition-colors",
                activeTab === tab.id
                  ? "text-brand-700"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-brand-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description={
              activeTab === "all"
                ? "You haven't placed any orders yet."
                : `No ${activeTab} orders found.`
            }
            action={
              <Link href="/stores">
                <Button size="lg">Start Shopping</Button>
              </Link>
            }
          />
        ) : (
          <div className="stagger space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
