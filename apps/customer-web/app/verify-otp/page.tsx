"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Timer } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { OtpInput } from "../components/auth/OtpInput";
import { Button } from "../components/ui/Button";
import { useLang } from "../i18n/LanguageContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type VerifyResponse = {
  data?: { tokens: { accessToken: string; refreshToken: string } };
  message?: string;
};

function VerifyOtpForm() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const challengeId = searchParams.get("challengeId") || undefined;
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((value) => value - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${phone}` }),
    });
    const payload = (await response.json()) as { data?: { challengeId: string }; message?: string };
    if (!response.ok || !payload.data?.challengeId) {
      throw new Error(payload.message ?? t("We could not resend the OTP."));
    }
    return payload.data.challengeId;
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    setError("");
    try {
      const nextChallengeId = await sendOtp();
      const nextUrl = `/verify-otp?phone=${phone}&challengeId=${nextChallengeId}`;
      router.replace(nextUrl);
      setTimer(30);
      setCanResend(false);
      setOtp("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("We could not resend the OTP."));
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (otp.length !== 6 || !phone || !challengeId) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}`, otp, challengeId }),
      });
      const payload = (await response.json()) as VerifyResponse;
      if (!response.ok || !payload.data?.tokens.accessToken) {
        throw new Error(payload.message ?? t("The OTP could not be verified."));
      }
      window.localStorage.setItem("qb_access_token", payload.data.tokens.accessToken);
      window.localStorage.setItem("qb_refresh_token", payload.data.tokens.refreshToken);
      router.push("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("The OTP could not be verified."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("Enter OTP")} subtitle={`${t("Enter the 6-digit code sent to")} +91 ${phone}`}>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <OtpInput value={otp} onChange={setOtp} />
        <Button type="submit" size="lg" className="w-full" disabled={otp.length !== 6 || loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          {loading ? t("Verifying...") : t("Verify OTP")}
        </Button>

        {error && <p className="text-center text-xs font-medium text-error">{error}</p>}

        <div className="text-center">
          {canResend ? (
            <button type="button" onClick={handleResend} disabled={resending} className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition-colors hover:underline disabled:opacity-60">
              {resending && <Loader2 size={14} className="animate-spin" />}
              {t("Resend OTP")}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm tabular-nums text-gray-500"><Timer size={14} aria-hidden="true" />{t("Resend in")} {timer}s</span>
          )}
        </div>

        <Link href="/login" className="inline-flex items-center justify-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-800"><ArrowLeft size={14} aria-hidden="true" />{t("Back to login")}</Link>
      </form>
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return <Suspense fallback={null}><VerifyOtpForm /></Suspense>;
}
