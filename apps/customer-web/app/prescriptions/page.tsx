"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, FileCheck2, FileUp, ShieldCheck } from "lucide-react";
import {
  createPrescriptionSubmission,
  listPrescriptionSubmissions,
  uploadPrescriptionDocument,
  type PrescriptionSubmission,
} from "../../lib/api";

const statusCopy: Record<PrescriptionSubmission["status"], string> = {
  pending: "Pending review / review बाकी",
  approved: "Approved / approved",
  rejected: "Rejected / reject हुआ",
  expired: "Expired / expire हो गया",
};

export default function PrescriptionsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [businessId, setBusinessId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [submissions, setSubmissions] = useState<PrescriptionSubmission[]>([]);
  const [message, setMessage] = useState("Sign in to upload a prescription / prescription upload करने के लिए sign in करें");
  const [busy, setBusy] = useState(false);

  const loadSubmissions = useCallback(async () => {
    try {
      setSubmissions(await listPrescriptionSubmissions());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load submissions / submissions नहीं लोड हुए");
    }
  }, []);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file || !businessId || !productId) {
      setMessage("Choose a file and enter store/product IDs / file चुनें और store/product IDs भरें");
      return;
    }

    setBusy(true);
    setMessage("Uploading securely / secure upload हो रहा है…");
    try {
      const upload = await uploadPrescriptionDocument(file);
      await createPrescriptionSubmission({
        businessId,
        items: [{ productId, quantity: Number(quantity) }],
        upload,
      });
      setMessage("Prescription submitted for review / prescription review के लिए submit हो गया");
      setFile(null);
      setBusinessId("");
      setProductId("");
      setQuantity("1");
      const input = document.getElementById("prescription-file") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadSubmissions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed / upload विफल हुआ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft size={18} /> Back to QuickBasket / वापस जाएँ
        </Link>

        <header className="mt-8 rounded-3xl bg-primary px-6 py-8 text-white shadow-soft sm:px-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white/15 p-3"><ShieldCheck size={28} /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/75">Medicines / दवाइयाँ</p>
              <h1 className="mt-2 font-display text-3xl font-bold">Prescription review / prescription review</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">Upload a clear PDF or image. Our operations team reviews it before prescription products can be ordered. / साफ PDF या image upload करें; prescription products order करने से पहले हमारी team review करेगी।</p>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <form onSubmit={submit} className="rounded-3xl border border-paper-200 bg-surface p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3"><FileUp className="text-primary" size={22} /><h2 className="font-display text-xl font-bold">New submission / नया submission</h2></div>
            <p className="mt-2 text-sm text-gray-600">The IDs connect the review to the exact store and prescription product. / IDs exact store और product से जोड़ते हैं।</p>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-gray-800">Prescription file / prescription file<input id="prescription-file" type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-paper-300 bg-white px-3 py-3 text-sm" required /></label>
              <label className="block text-sm font-semibold text-gray-800">Store UUID / store UUID<input value={businessId} onChange={(event) => setBusinessId(event.target.value)} placeholder="Business UUID" className="mt-2 w-full rounded-xl border border-paper-300 bg-white px-4 py-3 text-sm" required /></label>
              <label className="block text-sm font-semibold text-gray-800">Prescription product UUID / product UUID<input value={productId} onChange={(event) => setProductId(event.target.value)} placeholder="Product UUID" className="mt-2 w-full rounded-xl border border-paper-300 bg-white px-4 py-3 text-sm" required /></label>
              <label className="block text-sm font-semibold text-gray-800">Quantity / मात्रा<input value={quantity} onChange={(event) => setQuantity(event.target.value)} type="number" min="1" max="100" className="mt-2 w-full rounded-xl border border-paper-300 bg-white px-4 py-3 text-sm" required /></label>
            </div>
            <button type="submit" disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Uploading… / upload हो रहा है…" : "Upload and submit / upload करके submit करें"}</button>
            <p className="mt-4 rounded-xl bg-paper-100 px-4 py-3 text-sm text-gray-600">{message}</p>
          </form>

          <section className="rounded-3xl border border-paper-200 bg-surface p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3"><FileCheck2 className="text-primary" size={22} /><h2 className="font-display text-xl font-bold">Your submissions / आपके submissions</h2></div>
            <div className="mt-6 space-y-3">
              {submissions.length === 0 ? <p className="rounded-xl bg-paper-100 p-4 text-sm text-gray-600">No submissions yet / अभी कोई submission नहीं है।</p> : submissions.map((submission) => <article key={submission.id} className="rounded-2xl border border-paper-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-gray-900">{submission.documentFileName}</p><p className="mt-1 text-xs text-gray-500">{new Date(submission.createdAt).toLocaleString()}</p></div><span className="rounded-full bg-paper-100 px-3 py-1 text-xs font-semibold text-primary">{statusCopy[submission.status]}</span></div>{submission.rejectionReason && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submission.rejectionReason}</p>}</article>)}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
