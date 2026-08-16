"use client";

import { useState } from "react";
import { KhataRequest, KhataEntry, LinkedShop } from "@quickbasket/types";
import { KhataLedgerItem } from "../components/KhataLedgerItem";
import { KhataHeader, KhataTabs, InitialTile } from "../ui";
import { cn } from "@quickbasket/ui";
import { Search, UserPlus, Users } from "lucide-react";

const mockRequests: KhataRequest[] = [
  {
    id: "req1",
    shopId: "shop1",
    customerId: "customer1",
    customerName: "Amit Sharma",
    customerPhone: "9876543210",
    status: "pending",
    requestedAt: "2026-08-15T14:20:00Z"
  },
  {
    id: "req2",
    shopId: "shop1",
    customerId: "customer2",
    customerName: "Priya Patel",
    customerPhone: "9876543211",
    status: "approved",
    requestedAt: "2026-08-14T09:15:00Z",
    approvedAt: "2026-08-14T10:30:00Z"
  }
];

const mockCustomers: LinkedShop[] = [
  {
    id: "customer1",
    name: "Amit Sharma",
    ownerId: "shop1",
    khataBalance: 850.50,
    lastActivity: "2026-08-15T10:30:00Z",
    phoneNumber: "9876543210"
  },
  {
    id: "customer2",
    name: "Priya Patel",
    ownerId: "shop1",
    khataBalance: 400.25,
    lastActivity: "2026-08-14T15:45:00Z",
    phoneNumber: "9876543211"
  },
  {
    id: "customer3",
    name: "Rahul Verma",
    ownerId: "shop1",
    khataBalance: 0,
    lastActivity: "2026-08-10T12:00:00Z",
    phoneNumber: "9876543212"
  }
];

const mockRecentActivity: KhataEntry[] = [
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
    customerId: "customer2",
    amount: 200.25,
    date: "2026-08-14T15:45:00Z",
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

interface ShopOwnerManagementProps {
  onReviewRequest?: () => void;
  onViewCustomer?: (customer: {
    id: string;
    name: string;
    phone: string;
    balance?: number;
  }) => void;
  onLogPurchase?: (customer: {
    id: string;
    name: string;
    phone: string;
  }) => void;
}

export function ShopOwnerManagement({
  onReviewRequest,
  onViewCustomer,
  onLogPurchase,
}: ShopOwnerManagementProps) {
  const [activeTab, setActiveTab] = useState<"requests" | "customers" | "activity">("requests");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = mockRequests.filter(request =>
    request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.customerPhone.includes(searchTerm)
  );

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <KhataHeader title="Khata Management" onBack={() => window.history.back()}>
        <div className="mt-4">
          <KhataTabs
            tabs={[
              { id: "requests", label: "Requests" },
              { id: "customers", label: "Customers" },
              { id: "activity", label: "Activity" },
            ]}
            active={activeTab}
            onChange={(id) => setActiveTab(id as typeof activeTab)}
          />
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
            placeholder={
              activeTab === "requests"
                ? "Search requests..."
                : activeTab === "customers"
                ? "Search customers..."
                : "Search activity..."
            }
            className="h-11 w-full rounded-full border border-paper-300 bg-paper-50 pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-paper-400 transition-colors focus:border-khata-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-khata-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === "requests" && (
          <div className="stagger space-y-3">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={request.status === "pending" ? onReviewRequest : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft transition-all",
                    request.status === "pending" && onReviewRequest
                      ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lift"
                      : ""
                  )}
                >
                  <InitialTile name={request.customerName} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm font-bold text-gray-900">
                      {request.customerName}
                    </h3>
                    <p className="mt-0.5 text-sm tabular-nums text-gray-600">{request.customerPhone}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Requested on {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {request.status === "pending" ? (
                    <span className="shrink-0 rounded-full bg-turmeric-100 px-3 py-1 text-xs font-bold text-turmeric-700">
                      Review
                    </span>
                  ) : (
                    <span className="shrink-0 text-sm font-bold text-brand-700">
                      {request.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-paper-300 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-100 text-paper-500">
                  <UserPlus size={24} aria-hidden="true" />
                </span>
                <p className="text-sm text-gray-600">No khata requests found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "customers" && (
          <div className="stagger space-y-3">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <InitialTile name={customer.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm font-bold text-gray-900">
                      {customer.name}
                    </h3>
                    <p className="mt-0.5 text-sm tabular-nums text-gray-600">{customer.phoneNumber}</p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums">
                      {customer.khataBalance > 0 ? (
                        <span className="text-khata-600">₹{customer.khataBalance.toFixed(2)} due</span>
                      ) : (
                        <span className="text-brand-700">No balance</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onViewCustomer?.({
                          id: customer.id,
                          name: customer.name,
                          phone: customer.phoneNumber,
                          balance: customer.khataBalance,
                        })
                      }
                      className="flex h-8 items-center rounded-button border border-paper-300 px-3 font-display text-xs font-bold text-gray-800 transition-colors hover:border-paper-400 hover:bg-paper-50"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onLogPurchase?.({
                          id: customer.id,
                          name: customer.name,
                          phone: customer.phoneNumber,
                        })
                      }
                      className="flex h-8 items-center rounded-button bg-khata-600 px-3 font-display text-xs font-bold text-khata-50 shadow-[0_2px_8px_-2px_rgb(115_38_29/0.45)] transition-all duration-150 hover:bg-khata-700 active:scale-95"
                    >
                      Log Purchase
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-paper-300 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-100 text-paper-500">
                  <Users size={24} aria-hidden="true" />
                </span>
                <p className="text-sm text-gray-600">No customers found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="stagger overflow-hidden rounded-card border border-paper-200/70 bg-surface shadow-soft">
            {mockRecentActivity.map((entry) => (
              <KhataLedgerItem
                key={entry.id}
                entry={entry}
                isCustomerView={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
