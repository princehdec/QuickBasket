"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
type Job = { id: string; orderId: string; partnerId?: string | null; source: "managed" | "third_party"; status: string; earnings: string };
type PrescriptionSubmission = { id: string; customerId: string; businessId: string; documentFileName: string; documentMimeType: string; documentSizeBytes: number; status: "pending" | "approved" | "rejected" | "expired"; rejectionReason?: string | null; createdAt: string };
type ApiPayload<T> = { data?: T; message?: string };

function token() { return typeof window === "undefined" ? null : window.localStorage.getItem("qb_access_token"); }

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const accessToken = token();
  if (!accessToken) throw new Error("Sign in as operations admin / operations admin के रूप में sign in करें");
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${accessToken}`, ...(init.headers ?? {}) } });
  const payload = await response.json() as ApiPayload<T>;
  if (!response.ok || payload.data === undefined) throw new Error(payload.message ?? "Request failed / अनुरोध विफल हुआ");
  return payload.data;
}

export default function AdminHome() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionSubmission[]>([]);
  const [orderId, setOrderId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [source, setSource] = useState<"managed" | "third_party">("managed");
  const [earnings, setEarnings] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Sign in as operations admin to load dispatch data / dispatch data के लिए sign in करें");

  const loadJobs = useCallback(async () => {
    setJobs(await apiRequest<Job[]>("/api/v1/admin/delivery/jobs"));
  }, []);

  const loadPrescriptions = useCallback(async () => {
    setPrescriptions(await apiRequest<PrescriptionSubmission[]>("/api/v1/prescriptions/admin"));
  }, []);

  useEffect(() => {
    Promise.all([loadJobs(), loadPrescriptions()]).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load admin data / admin data नहीं लोड हुआ")).finally(() => setLoading(false));
  }, [loadJobs, loadPrescriptions]);

  const reviewPrescription = async (id: string, status: "approved" | "rejected") => {
    const rejectionReason = status === "rejected" ? window.prompt("Reason / reject करने का कारण")?.trim() : undefined;
    if (status === "rejected" && !rejectionReason) return;
    try {
      await apiRequest<PrescriptionSubmission>(`/api/v1/prescriptions/admin/${id}`, { method: "PATCH", body: JSON.stringify({ status, rejectionReason }) });
      setMessage(status === "approved" ? "Prescription approved / prescription approve हुआ" : "Prescription rejected / prescription reject हुआ");
      await loadPrescriptions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Review failed / review विफल हुआ");
    }
  };

  const assign = async (event: FormEvent) => {
    event.preventDefault();
    if (!orderId || earnings === "") return;
    try {
      await apiRequest<Job>("/api/v1/admin/delivery/jobs/assign", { method: "POST", body: JSON.stringify({ orderId, partnerId: partnerId || undefined, source, earnings: Number(earnings) }) });
      setMessage("Delivery job assigned successfully / delivery job सफलतापूर्वक assign हुआ");
      setOrderId("");
      setPartnerId("");
      setEarnings("");
      await loadJobs();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not assign job / job assign नहीं हुआ");
    }
  };

  const unassignedJobs = jobs.filter((job) => job.status === "unassigned" || !job.partnerId);

  return (
    <main className="min-h-screen bg-[#F4F1E8] px-5 py-8 text-[#1E2620] md:px-10"><div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#236837]">QuickBasket Control Tower</p><h1 className="mt-2 text-3xl font-bold">Operations / संचालन</h1><p className="mt-1 text-[#5E6A60]">Lucknow + Gopalganj · Live dispatch queue</p></div><div className="rounded-xl bg-[#FFFDF7] px-4 py-3 text-sm shadow-sm">Online payments only · COD disabled</div></header>
      {message && <p className="mb-5 rounded-xl border border-[#E2DCCE] bg-[#FFFDF7] p-3 text-sm text-[#5E6A60]">{message}</p>}
      <section className="grid gap-4 md:grid-cols-4">{[["Live jobs / लाइव जॉब", String(jobs.length)], ["Unassigned / बिना पार्टनर", String(unassignedJobs.length)], ["Third-party / थर्ड पार्टी", String(jobs.filter((job) => job.source === "third_party").length)], ["Service / सेवा", loading ? "Loading" : "Live"]].map(([label, value]) => <article key={label} className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm"><p className="text-sm font-semibold text-[#5E6A60]">{label}</p><p className="mt-3 text-3xl font-bold text-[#236837]">{value}</p></article>)}</section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]"><div className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Dispatch jobs / डिलीवरी जॉब</h2><p className="text-sm text-[#5E6A60]">Monitor managed and third-party partner assignments.</p></div><button type="button" onClick={() => void loadJobs().catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Refresh failed / refresh विफल"))} className="rounded-lg border border-[#236837] px-3 py-2 text-xs font-semibold text-[#236837]">Refresh / फिर लोड करें</button></div>{loading ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">Loading / लोड हो रहा है…</p> : jobs.length === 0 ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">No dispatch jobs / अभी कोई dispatch job नहीं है।</p> : <div className="space-y-3">{jobs.map((job) => <div key={job.id} className="rounded-xl border border-[#ECE7DD] p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold">Order {job.orderId.slice(0, 8)}</p><span className="rounded-full bg-[#E8F3E9] px-3 py-1 text-xs font-semibold text-[#236837]">{job.status}</span></div><p className="mt-2 text-sm text-[#5E6A60]">{job.source} · Partner: {job.partnerId ? job.partnerId.slice(0, 8) : "unassigned"} · ₹{job.earnings}</p>{!job.partnerId && <button type="button" onClick={() => setOrderId(job.orderId)} className="mt-3 rounded-lg bg-[#F4D58D] px-3 py-2 text-xs font-semibold text-[#6D4C00]">Use this order / यह order चुनें</button>}</div>)}</div>}</div>
      <div className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm"><h2 className="text-xl font-bold">Assign delivery / पार्टनर असाइन</h2><p className="mt-1 text-sm text-[#5E6A60]">Use a UUID from the order or select an unassigned job.</p><form onSubmit={assign} className="mt-5 space-y-3"><input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Order UUID" className="w-full rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm outline-none focus:border-[#236837]" required /><input value={partnerId} onChange={(event) => setPartnerId(event.target.value)} placeholder="Partner UUID (optional)" className="w-full rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm outline-none focus:border-[#236837]" /><div className="grid grid-cols-2 gap-3"><select value={source} onChange={(event) => setSource(event.target.value as "managed" | "third_party")} className="rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm"><option value="managed">Managed rider</option><option value="third_party">Third party</option></select><input value={earnings} onChange={(event) => setEarnings(event.target.value)} type="number" min="0" placeholder="Earnings" className="rounded-xl border border-[#D8D2C6] bg-white px-4 py-3 text-sm" required /></div><button type="submit" className="w-full rounded-xl bg-[#236837] px-5 py-3 font-semibold text-white">Assign job / जॉब असाइन करें</button></form></div></section>
      <section className="mt-8 rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Prescription review / prescription review</h2><p className="text-sm text-[#5E6A60]">Review pending documents before medicine checkout.</p></div><button type="button" onClick={() => void loadPrescriptions()} className="rounded-lg border border-[#236837] px-3 py-2 text-xs font-semibold text-[#236837]">Refresh / फिर लोड करें</button></div>{prescriptions.length === 0 ? <p className="rounded-xl bg-[#F4F0E7] p-4 text-sm text-[#5E6A60]">No pending submissions / pending submission नहीं है।</p> : <div className="space-y-3">{prescriptions.map((prescription) => <article key={prescription.id} className="rounded-xl border border-[#ECE7DD] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{prescription.documentFileName}</p><p className="mt-1 text-xs text-[#5E6A60]">Customer {prescription.customerId.slice(0, 8)} · Store {prescription.businessId.slice(0, 8)}</p></div><span className="rounded-full bg-[#FFF3CF] px-3 py-1 text-xs font-semibold text-[#6D4C00]">{prescription.status}</span></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => void reviewPrescription(prescription.id, "approved")} className="rounded-lg bg-[#236837] px-3 py-2 text-xs font-semibold text-white">Approve / approve करें</button><button type="button" onClick={() => void reviewPrescription(prescription.id, "rejected")} className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700">Reject / reject करें</button></div></article>)}</div>}</section>
    </div></main>
  );
}
