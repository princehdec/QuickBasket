"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, Package, Store } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useLang } from "../../i18n/LanguageContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Order = { orderNumber: string; businessId: string; status: string; paymentMethod: string; paymentStatus: string; grandTotal: number; createdAt: string; addressId: string; items: Array<{ productName: string; productUnit: string | null; quantity: number; price: number }> };

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { t } = useLang();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ orderId: id }) => {
      setOrderId(id);
      const token = window.localStorage.getItem("qb_access_token");
      if (!token) { setLoading(false); return; }
      fetch(`${API_BASE_URL}/api/v1/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(async (response) => {
          const payload = await response.json() as { data?: Order; message?: string };
          if (!response.ok || !payload.data) throw new Error(payload.message ?? t("Order not found"));
          setOrder(payload.data);
        })
        .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : t("Order not found")))
        .finally(() => setLoading(false));
    });
  }, [params, t]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="animate-spin text-brand-600" /></div>;
  if (!order) return <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4"><EmptyState icon={Package} title={t("Order not found")} description={error || t("The order you're looking for doesn't exist.")} action={<Link href="/orders"><Button variant="outline">{t("View All Orders")}</Button></Link>} /></div>;

  const statusLabel = order.status === "delivered" ? "Delivered" : order.status === "cancelled" ? "Cancelled" : order.status.replaceAll("_", " ");
  return <div className="min-h-screen bg-background"><div className="sticky top-0 z-30 border-b border-paper-200/80 bg-surface/90 backdrop-blur-md shadow-soft"><div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4"><Link href="/orders" aria-label="Back to orders" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-paper-200/70"><ArrowLeft size={20} /></Link><h1 className="font-display text-base font-bold text-gray-900">{t("Order Details")}</h1><span className="ml-auto text-xs font-semibold text-gray-500">{order.orderNumber}</span></div></div><main className="mx-auto max-w-3xl space-y-5 px-4 py-6"><section className="rounded-card bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-paper-50 shadow-lift"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">{t("Order Status")}</p><p className="mt-1 font-display text-xl font-extrabold capitalize">{t(statusLabel)}</p><p className="mt-2 text-sm text-white/80">{new Date(order.createdAt).toLocaleString()}</p></section><section className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft"><h2 className="font-display text-base font-bold text-gray-900">{t("Order Information")}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3"><Store size={18} className="text-brand-700" /><div><p className="text-xs text-gray-500">{t("Business")}</p><p className="text-sm font-semibold">{order.businessId}</p></div></div><div className="flex items-center gap-3"><MapPin size={18} className="text-info" /><div><p className="text-xs text-gray-500">{t("Address")}</p><p className="text-sm font-semibold">{order.addressId}</p></div></div></div></section><section className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft"><h2 className="font-display text-base font-bold text-gray-900">{t("Items")}</h2><div className="mt-3 space-y-3">{order.items.map((item) => <div key={`${item.productName}-${item.quantity}`} className="flex items-center justify-between border-b border-paper-200/70 pb-3 text-sm"><div><p className="font-semibold">{item.productName}</p><p className="text-xs text-gray-500">{item.productUnit ?? ""} · ×{item.quantity}</p></div><p className="font-display font-bold">₹{(item.price * item.quantity).toFixed(2)}</p></div>)}</div><div className="mt-4 flex items-center justify-between"><span className="font-display font-bold">{t("Grand Total")}</span><span className="font-display text-xl font-bold text-brand-700">₹{order.grandTotal.toFixed(2)}</span></div></section><section className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft"><p className="text-xs text-gray-500">{t("Payment")}</p><p className="mt-1 text-sm font-semibold capitalize">{order.paymentMethod.replaceAll("_", " ")} · {order.paymentStatus}</p></section><Link href="/orders" className="inline-flex text-sm font-bold text-brand-700">{t("Back to all orders")}</Link><span className="sr-only">{orderId}</span></main></div>;
}
