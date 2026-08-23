"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Package, ShoppingBag } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { useLang } from "../i18n/LanguageContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
type Tab = "all" | "active" | "completed" | "cancelled";

type ApiOrder = {
  id: string;
  orderNumber: string;
  businessId: string;
  status: string;
  grandTotal: number;
  items: Array<{ quantity: number; productName: string }>;
  createdAt: string;
};

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function getTabStatus(status: string): Exclude<Tab, "all"> {
  if (status === "delivered") return "completed";
  if (status === "cancelled") return "cancelled";
  return "active";
}

export default function OrdersPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("qb_access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/v1/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const payload = (await response.json()) as { data?: ApiOrder[]; message?: string };
        if (!response.ok) throw new Error(payload.message ?? t("Could not load orders."));
        setOrders(payload.data ?? []);
      })
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : t("Could not load orders.")))
      .finally(() => setLoading(false));
  }, [t]);

  const filteredOrders = useMemo(
    () => activeTab === "all" ? orders : orders.filter((order) => getTabStatus(order.status) === activeTab),
    [activeTab, orders],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-paper-200/80 bg-surface/90 backdrop-blur-md shadow-soft">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-base font-bold tracking-tight text-gray-900">{t("My Orders")}</h1>
        </div>
      </div>

      <div className="border-b border-paper-200/80 bg-surface">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={cn("relative shrink-0 px-4 py-3 font-display text-sm font-bold transition-colors", activeTab === tab.id ? "text-brand-700" : "text-gray-500 hover:text-gray-800")}>
              {t(tab.label)}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-600" /></div>
        ) : error ? (
          <p className="rounded-card bg-khata-50 p-4 text-center text-sm font-medium text-khata-700">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <EmptyState icon={Package} title={t("No orders yet")} description={t("You haven't placed any orders yet.")} action={<Link href="/stores"><Button size="lg">{t("Start Shopping")}</Button></Link>} />
        ) : (
          <div className="stagger space-y-3">
            {filteredOrders.map((order) => {
              const status = getTabStatus(order.status);
              return (
                <div key={order.id} className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-sm"><ShoppingBag size={18} className="text-white" /></div><div><p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p><h3 className="text-sm font-semibold text-gray-900">Business {order.businessId.slice(0, 8)}</h3></div></div>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold", status === "active" && "bg-info/10 text-info", status === "completed" && "bg-brand-100 text-brand-800", status === "cancelled" && "bg-khata-100 text-khata-700")}>{t(status === "completed" ? "Delivered" : status === "cancelled" ? "Cancelled" : "Active")}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm tabular-nums text-gray-600"><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span><span className="font-display font-bold text-gray-900">₹{order.grandTotal}</span><span className="text-xs">ID: {order.orderNumber}</span></div>
                  <div className="mt-3 flex justify-end border-t border-paper-200/80 pt-3"><Link href={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800">{t("View Details")}<ArrowRight size={14} /></Link></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
