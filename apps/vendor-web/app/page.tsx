"use client";

import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");

type VendorBusiness = { id: string; name: string; city: string; businessType: string; isActive: boolean };
type VendorProduct = { id: string; businessId: string; name: string; categoryName?: string | null; price: string; stock: number; isActive: boolean; isBestseller: boolean };
type VendorOrder = { id: string; orderNumber: string; businessId: string; status: "placed" | "confirmed" | "preparing" | "packed" | "cancelled" | string; grandTotal: string | number; items: Array<{ quantity: number; productName: string }> };

type ApiPayload<T> = { data?: T; message?: string };

function token() {
  return typeof window === "undefined" ? null : window.localStorage.getItem("qb_access_token");
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const accessToken = token();
  if (!accessToken) throw new Error("Sign in as a vendor to manage your store / दुकान प्रबंधित करने के लिए vendor sign-in करें");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${accessToken}`, ...(init.headers ?? {}) },
  });
  const payload = await response.json() as ApiPayload<T>;
  if (!response.ok || payload.data === undefined) throw new Error(payload.message ?? "Request failed / अनुरोध विफल हुआ");
  return payload.data;
}

export default function VendorHome() {
  const [businesses, setBusinesses] = useState<VendorBusiness[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async () => {
    setOrders(await apiRequest<VendorOrder[]>("/api/v1/orders/vendor/queue"));
  }, []);

  const loadProducts = useCallback(async (businessId: string) => {
    if (!businessId) {
      setProducts([]);
      return;
    }
    const result = await apiRequest<{ items: VendorProduct[] }>(`/api/v1/products?businessId=${encodeURIComponent(businessId)}&limit=100`);
    setProducts(result.items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      apiRequest<VendorBusiness[]>("/api/v1/businesses/me"),
      apiRequest<VendorOrder[]>("/api/v1/orders/vendor/queue"),
    ])
      .then(([nextBusinesses, nextOrders]) => {
        if (cancelled) return;
        setBusinesses(nextBusinesses);
        setOrders(nextOrders);
        setSelectedBusinessId((current) => current || nextBusinesses[0]?.id || "");
      })
      .catch((error: unknown) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Could not load vendor operations / vendor data नहीं लोड हो सका");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedBusinessId) return;
    loadProducts(selectedBusinessId).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load catalog / catalog नहीं लोड हो सका"));
  }, [selectedBusinessId, loadProducts]);

  const updateStatus = async (orderId: string, status: "confirmed" | "preparing" | "packed" | "cancelled") => {
    try {
      await apiRequest(`/api/v1/orders/vendor/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await loadOrders();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update order / order update नहीं हो सका");
    }
  };

  const updateProduct = async (product: VendorProduct, changes: Partial<Pick<VendorProduct, "price" | "stock" | "isActive">>) => {
    setSavingProductId(product.id);
    setMessage("");
    try {
      const updated = await apiRequest<VendorProduct>(`/api/v1/products/${product.id}`, { method: "PATCH", body: JSON.stringify(changes) });
      setProducts((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update product / product update नहीं हो सका");
    } finally {
      setSavingProductId(null);
    }
  };

  const selectedBusiness = businesses.find((business) => business.id === selectedBusinessId);
  const pendingOrders = orders.filter((order) => order.status === "placed").length;

  return (
    <main className="min-h-screen bg-[#FBF9F3] px-5 py-8 text-[#1E2620] md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2F8144]">QuickBasket Vendor</p><h1 className="mt-2 text-3xl font-bold">Vendor operations / दुकान संचालन</h1><p className="mt-1 text-[#5E6A60]">Lucknow + Gopalganj · Live orders and catalog</p></div>
          {businesses.length > 0 && <label className="text-sm font-semibold text-[#5E6A60]">Store / दुकान<select value={selectedBusinessId} onChange={(event) => setSelectedBusinessId(event.target.value)} className="mt-1 block rounded-xl border border-[#DCD6C8] bg-white px-3 py-2 font-medium text-[#1E2620]"><option value="">Select store</option>{businesses.map((business) => <option key={business.id} value={business.id}>{business.name} · {business.city}</option>)}</select></label>}
        </header>

        {message && <p className="mb-5 rounded-xl border border-[#E9C9C2] bg-[#FFF2EF] p-3 text-sm text-[#8E2F23]">{message}</p>}
        <section className="grid gap-4 md:grid-cols-4">{[["Stores / दुकानें", String(businesses.length)], ["Live orders / लाइव ऑर्डर", String(orders.length)], ["Pending action / लंबित", String(pendingOrders)], ["Catalog items / उत्पाद", String(products.length)]].map(([label, value]) => <article key={label} className="rounded-2xl border border-[#E7E2D7] bg-[#FFFDF7] p-5 shadow-sm"><p className="text-sm font-semibold text-[#5E6A60]">{label}</p><p className="mt-3 text-3xl font-bold text-[#236837]">{value}</p></article>)}</section>

        <section className="mt-8 rounded-2xl border border-[#E7E2D7] bg-[#FFFDF7] p-5 shadow-sm"><div className="mb-5"><h2 className="text-xl font-bold">Catalog / उत्पाद सूची</h2><p className="text-sm text-[#5E6A60]">Adjust stock, price, and availability for your selected store.</p></div>{loading ? <p className="text-sm text-[#5E6A60]">Loading / लोड हो रहा है…</p> : !selectedBusiness ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">No vendor store is linked to this account / इस account से कोई दुकान नहीं जुड़ी है।</p> : products.length === 0 ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">No catalog items yet / अभी कोई उत्पाद नहीं है।</p> : <div className="space-y-3">{products.map((product) => <div key={product.id} className="grid gap-3 rounded-xl border border-[#ECE7DD] p-4 md:grid-cols-[1fr_auto_auto_auto]"><div><p className="font-bold">{product.name}</p><p className="mt-1 text-sm text-[#5E6A60]">{product.categoryName ?? "Catalog item"} · ₹{product.price}</p></div><label className="text-xs font-semibold text-[#5E6A60]">Price<input className="mt-1 w-28 rounded-lg border border-[#DCD6C8] px-2 py-2 text-sm" type="number" min="0" step="0.01" defaultValue={product.price} onBlur={(event) => { const price = event.target.value; if (price && price !== product.price) void updateProduct(product, { price }); }} /></label><label className="text-xs font-semibold text-[#5E6A60]">Stock<input className="mt-1 w-24 rounded-lg border border-[#DCD6C8] px-2 py-2 text-sm" type="number" min="0" step="1" defaultValue={product.stock} onBlur={(event) => { const stock = Number(event.target.value); if (Number.isInteger(stock) && stock !== product.stock) void updateProduct(product, { stock }); }} /></label><button type="button" disabled={savingProductId === product.id} onClick={() => void updateProduct(product, { isActive: !product.isActive })} className={`self-end rounded-lg px-3 py-2 text-sm font-semibold ${product.isActive ? "bg-[#E6F3E6] text-[#236837]" : "bg-[#F4F0E7] text-[#6D756E]"}`}>{savingProductId === product.id ? "Saving…" : product.isActive ? "Active / चालू" : "Hidden / बंद"}</button></div>)}</div>}</section>

        <section className="mt-8 rounded-2xl border border-[#E7E2D7] bg-[#FFFDF7] p-5 shadow-sm"><div className="mb-5"><h2 className="text-xl font-bold">Live orders / लाइव ऑर्डर</h2><p className="text-sm text-[#5E6A60]">Accept and prepare orders so dispatch can assign a partner.</p></div>{loading ? <p className="text-sm text-[#5E6A60]">Loading / लोड हो रहा है…</p> : orders.length === 0 ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">No live orders / अभी कोई live order नहीं है।</p> : <div className="space-y-3">{orders.map((order) => <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-[#ECE7DD] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{order.orderNumber} · {order.status}</p><p className="mt-1 text-sm text-[#5E6A60]">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · ₹{order.grandTotal}</p></div><div className="flex flex-wrap gap-2">{order.status === "placed" && <button onClick={() => void updateStatus(order.id, "confirmed")} className="rounded-lg bg-[#236837] px-4 py-2 text-sm font-semibold text-white">Accept / स्वीकारें</button>}{order.status === "confirmed" && <button onClick={() => void updateStatus(order.id, "preparing")} className="rounded-lg border border-[#236837] px-4 py-2 text-sm font-semibold text-[#236837]">Start preparing / तैयारी</button>}{order.status === "preparing" && <button onClick={() => void updateStatus(order.id, "packed")} className="rounded-lg border border-[#236837] px-4 py-2 text-sm font-semibold text-[#236837]">Ready for pickup / pickup तैयार</button>}{["placed", "confirmed", "preparing"].includes(order.status) && <button onClick={() => void updateStatus(order.id, "cancelled")} className="rounded-lg border border-[#8E2F23] px-4 py-2 text-sm font-semibold text-[#8E2F23]">Cancel / रद्द</button>}</div></div>)}</div>}</section>
      </div>
    </main>
  );
}
