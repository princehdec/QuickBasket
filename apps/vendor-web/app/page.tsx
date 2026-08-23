"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type VendorOrder = {
  id: string;
  orderNumber: string;
  businessId: string;
  status: "placed" | "confirmed" | "preparing" | "packed" | "cancelled" | string;
  grandTotal: number;
  items: Array<{ quantity: number; productName: string }>;
};

function token() {
  return typeof window === "undefined" ? null : window.localStorage.getItem("qb_access_token");
}

export default function VendorHome() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Sign in as a vendor to load live orders.");

  const loadOrders = async () => {
    const accessToken = token();
    if (!accessToken) {
      setLoading(false);
      return;
    }
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/vendor/queue`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const payload = await response.json() as { data?: VendorOrder[]; message?: string };
    if (!response.ok) throw new Error(payload.message ?? "Could not load vendor orders");
    setOrders(payload.data ?? []);
  };

  useEffect(() => {
    loadOrders().catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load vendor orders")).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: "confirmed" | "preparing" | "packed" | "cancelled") => {
    const accessToken = token();
    if (!accessToken) return;
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/vendor/${orderId}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ status }) });
    const payload = await response.json() as { message?: string };
    if (!response.ok) throw new Error(payload.message ?? "Could not update order");
    await loadOrders();
  };

  return (
    <main className="min-h-screen bg-[#FBF9F3] px-5 py-8 text-[#1E2620] md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2F8144]">QuickBasket Vendor</p><h1 className="mt-2 text-3xl font-bold">Vendor operations / दुकान संचालन</h1><p className="mt-1 text-[#5E6A60]">Lucknow + Gopalganj · Live order queue</p></div><button className="rounded-xl bg-[#236837] px-5 py-3 font-semibold text-white shadow-sm">Manage store / दुकान प्रबंधित करें</button></header>
        <section className="grid gap-4 md:grid-cols-3">{[["Live orders / लाइव ऑर्डर", String(orders.length)], ["Pending action / लंबित", String(orders.filter((order) => order.status === "placed").length)], ["This page / यह पेज", "API-backed"]].map(([label, value]) => <article key={label} className="rounded-2xl border border-[#E7E2D7] bg-[#FFFDF7] p-5 shadow-sm"><p className="text-sm font-semibold text-[#5E6A60]">{label}</p><p className="mt-3 text-3xl font-bold text-[#236837]">{value}</p></article>)}</section>
        <section className="mt-8 rounded-2xl border border-[#E7E2D7] bg-[#FFFDF7] p-5 shadow-sm"><div className="mb-5"><h2 className="text-xl font-bold">Live orders / लाइव ऑर्डर</h2><p className="text-sm text-[#5E6A60]">Accept and prepare orders so dispatch can assign a partner.</p></div>{loading ? <p className="text-sm text-[#5E6A60]">Loading orders…</p> : orders.length === 0 ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">{message}</p> : <div className="space-y-3">{orders.map((order) => <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-[#ECE7DD] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{order.orderNumber} · {order.status}</p><p className="mt-1 text-sm text-[#5E6A60]">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · ₹{order.grandTotal}</p></div><div className="flex flex-wrap gap-2">{order.status === "placed" && <button onClick={() => updateStatus(order.id, "confirmed").catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Update failed"))} className="rounded-lg bg-[#236837] px-4 py-2 text-sm font-semibold text-white">Accept</button>}{order.status === "confirmed" && <button onClick={() => updateStatus(order.id, "preparing").catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Update failed"))} className="rounded-lg border border-[#236837] px-4 py-2 text-sm font-semibold text-[#236837]">Start preparing</button>}{order.status === "preparing" && <button onClick={() => updateStatus(order.id, "packed").catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Update failed"))} className="rounded-lg border border-[#236837] px-4 py-2 text-sm font-semibold text-[#236837]">Ready for pickup</button>}{["placed", "confirmed", "preparing"].includes(order.status) && <button onClick={() => updateStatus(order.id, "cancelled").catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Update failed"))} className="rounded-lg border border-[#8E2F23] px-4 py-2 text-sm font-semibold text-[#8E2F23]">Cancel</button>}</div></div>)}</div>}</section>
      </div>
    </main>
  );
}
