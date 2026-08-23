"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, Loader2 } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PhoneInput } from "../components/auth/PhoneInput";
import { Button } from "../components/ui/Button";
import { useLang } from "../i18n/LanguageContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      const payload = (await response.json()) as { data?: { challengeId: string }; message?: string };
      if (!response.ok || !payload.data?.challengeId) {
        throw new Error(payload.message ?? t("We could not send the OTP."));
      }
      router.push(`/verify-otp?phone=${phone}&challengeId=${payload.data.challengeId}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("We could not send the OTP."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("Welcome back")} subtitle={t("Enter your phone number to continue")}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <PhoneInput value={phone} onChange={setPhone} />

        <Button type="submit" size="lg" className="w-full" disabled={phone.length !== 10 || loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          {loading ? t("Sending OTP...") : t("Continue with OTP")}
        </Button>

        {error && <p className="text-center text-xs font-medium text-error">{error}</p>}

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-paper-300" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 font-semibold tracking-[0.12em] text-paper-500">{t("or")}</span></div>
        </div>

        <button type="button" className="flex h-12 w-full items-center justify-center gap-3 rounded-button border border-paper-300 bg-surface text-sm font-bold text-gray-800 transition-all hover:border-paper-400 hover:bg-paper-50 active:scale-[0.99]">
          <Globe size={18} />
          {t("Continue with Google")}
        </button>

        <p className="text-center text-xs text-gray-500">
          {t("By continuing, you agree to our")} <Link href="#" className="font-bold text-brand-700 hover:underline">{t("Terms")}</Link> {t("and")} <Link href="#" className="font-bold text-brand-700 hover:underline">{t("Privacy Policy")}</Link>
        </p>

        <p className="text-center text-sm text-gray-600">
          {t("Don't have an account?")} <Link href="/signup" className="font-bold text-brand-700 hover:underline">{t("Sign up")}</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
