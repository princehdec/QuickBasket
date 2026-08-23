"use client";

import { FormEvent, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Job = { id: string; orderId: string; partnerId?: string | null; source: "managed" | "third_party"; status: string; earnings: string };

function token() { return typeof window === "undefined" ? null : window.localStorage.getItem("qb_access_token"); }

export default function AdminHome() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [orderId, setOrderId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [source, setSource] = useState<"managed" | "third_party">("managed");
  const [earnings, setEarnings] = useState("80");
  const [message, setMessage] = useState("Sign in as operations admin to load dispatch data.");

  const loadJobs = async () => {
    const accessToken = token();
    if (!accessToken) return;
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/delivery/jobs`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const payload = await response.json() as { data?: Job[]; message?: string };
    if (!response.ok) throw new Error(payload.message ?? "Could not load dispatch jobs");
    setJobs(payload.data ?? []);
  };

  useEffect(() => { loadJobs().catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load dispatch jobs")); }, []);

  const assign = async (event: FormEvent) => {
    event.preventDefault();
    const accessToken = token();
    if (!accessToken || !orderId) return;
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/delivery/jobs/assign`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ orderId, partnerId: partnerId || undefined, source, earnings: Number(earnings) }) });
    const payload = await response.json() as { message?: string };
    if (!response.ok) { setMessage(payload.message ?? "Could not assign job"); return; }
    setMessage("Delivery job assigned successfully"); setOrderId(""); setPartnerId(""); await loadJobs();
  };

  return (
    <main className="min-h-screen bg-[#F4F1E8] px-5 py-8 text-[#1E2620] md:px-10"><div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#236837]">QuickBasket Control Tower</p><h1 className="mt-2 text-3xl font-bold">Operations / संचालन</h1><p className="mt-1 text-[#5E6A60]">Lucknow + Gopalganj · Live dispatch queue</p></div><div className="rounded-xl bg-[#FFFDF7] px-4 py-3 text-sm shadow-sm">Online payments only · COD disabled</div></header>
      <section className="grid gap-4 md:grid-cols-3">{[["Live jobs / लाइव जॉब", String(jobs.length)], ["Unassigned / बिना पार्टनर", String(jobs.filter((job) => job.status === "unassigned").length)], ["Third-party / थर्ड पार्टी", String(jobs.filter((job) => job.source === "third_party").length)]].map(([label, value]) => <article key={label} className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm"><p className="text-sm font-semibold text-[#5E6A60]">{label}</p><p className="mt-3 text-3xl font-bold text-[#236837]">{value}</p></article>)}</section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]"><div className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm"><div className="mb-5"><h2 className="text-xl font-bold">Dispatch jobs / डिलीवरी जॉब</h2><p className="text-sm text-[#5E6A60]">Monitor managed and third-party partner assignments.</p></div>{jobs.length === 0 ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">{message}</p> : <div className="space-y-3">{jobs.map((job) => <div key={job.id} className="rounded-xl border border-[#ECE7DD] p-4"><div className="flex items-center justify-between"><p className="font-bold">Order {job.orderId.slice(0, 8)}</p><span className="rounded-full bg-[#E8F3E9] px-3 py-1 text-xs font-semibold text-[#236837]">{job.status}</span></div><p className="mt-2 text-sm text-[#5E6A60]">{job.source} · Partner: {job.partnerId ? job.partnerId.slice(0, 8) : "unassigned"} · ₹{job.earnings}</p></div>)}</div>}</div>
      <div className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm"><h2 className="text-xl font-bold">Assign delivery / पार्टनर असाइन</h2><p className="mt-1 text-sm text-[#5E6A60]">Use this for managed or approved third-party partners.</p><form onSubmit={assign} className="mt-5 space-y-3"><input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Order UUID" className="w-full rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm outline-none focus:border-[#236837]" required /><input value={partnerId} onChange={(event) => setPartnerId(event.target.value)} placeholder="Partner UUID (optional)" className="w-full rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm outline-none focus:border-[#236837]" /><div className="grid grid-cols-2 gap-3"><select value={source} onChange={(event) => setSource(event.target.value as "managed" | "third_party")} className="rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm"><option value="managed">Managed rider</option><option value="third_party">Third party</option></select><input value={earnings} onChange={(event) => setEarnings(event.target.value)} type="number" min="0" placeholder="Earnings" className="rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm" /></div><button className="w-full rounded-xl bg-[#236837] px-5 py-3 font-semibold text-white">Assign job / जॉब असाइन करें</button></form><p className="mt-4 text-xs text-[#5E6A60]">{message}</p></div></section>
    </div></main>
  );
}
