"use client";

import { useState } from "react";
import { KhataRequest, KhataEntry, LinkedShop } from "@quickbasket/types";
import { KhataLedgerItem } from "../components/KhataLedgerItem";
import { Button, Card, Input } from "@quickbasket/ui";
import { LucideArrowLeft, LucideSearch, LucideStore, LucideUser, LucideUserCheck, LucideUserPlus, LucideUsers } from "lucide-react";

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
    <div className="min-h-screen bg-neutral-100">
      <div className="sticky top-0 bg-white z-10 py-4 px-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <LucideArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-neutral-900">Khata Management</h1>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === "requests" ? "text-primary border-b-2 border-primary" : "text-neutral-600"}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === "customers" ? "text-primary border-b-2 border-primary" : "text-neutral-600"}`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === "activity" ? "text-primary border-b-2 border-primary" : "text-neutral-600"}`}
          >
            Activity
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="relative mb-4">
          <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4" />
          <Input
            placeholder={activeTab === "requests" ? "Search requests..." :
                        activeTab === "customers" ? "Search customers..." : "Search activity..."}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === "requests" && (
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className={`p-4 ${request.status === "pending" && onReviewRequest ? "cursor-pointer" : ""}`}
                  onClick={request.status === "pending" ? onReviewRequest : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <LucideUser className="w-5 h-5 text-primary" />
                        <h3 className="font-medium text-neutral-900">{request.customerName}</h3>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">{request.customerPhone}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Requested on {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {request.status === "pending" ? (
                        <>
                          <Button variant="outline" size="sm">Reject</Button>
                          <Button size="sm">Approve</Button>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-success">
                          {request.status === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-600">
                <LucideUserPlus className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                <p className="text-sm">No khata requests found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-4">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <Card key={customer.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <LucideUserCheck className="w-5 h-5 text-primary" />
                        <h3 className="font-medium text-neutral-900">{customer.name}</h3>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">{customer.phoneNumber}</p>
                      <p className="text-sm mt-1">
                        {customer.khataBalance > 0 ? (
                          <span className="text-error">₹{customer.khataBalance.toFixed(2)} due</span>
                        ) : (
                          <span className="text-success">No balance</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onViewCustomer?.({
                            id: customer.id,
                            name: customer.name,
                            phone: customer.phoneNumber,
                            balance: customer.khataBalance,
                          })
                        }
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          onLogPurchase?.({
                            id: customer.id,
                            name: customer.name,
                            phone: customer.phoneNumber,
                          })
                        }
                      >
                        Log Purchase
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-600">
                <LucideUsers className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                <p className="text-sm">No customers found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
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