"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Timer } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { OtpInput } from "../components/auth/OtpInput";
import { Button } from "../components/ui/Button";

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "9876543210";
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp("");
  };

  return (
    <AuthLayout
      title="Enter OTP"
      subtitle={`Enter the 6-digit code sent to +91 ${phone}`}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col items-center gap-6"
      >
        <OtpInput value={otp} onChange={setOtp} />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={otp.length !== 6}
        >
          Verify OTP
          <ArrowRight size={16} />
        </Button>

        <div className="text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-brand-600 transition-colors hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
              <Timer size={14} aria-hidden="true" />
              Resend in {timer}s
            </span>
          )}
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to login
        </Link>
      </form>
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
