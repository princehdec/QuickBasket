"use client";

import { useState, useEffect } from "react";
import { LockKeyhole } from "lucide-react";
import { cn } from "@quickbasket/ui";
import { khataInputClass } from "../ui";

interface OTPVerificationProps {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export function OTPVerification({ phone, onVerify, onResend, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleResend = () => {
    onResend();
    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="hero-wash flex flex-col items-center justify-center px-4 py-12 min-h-[80vh]">
      <div className="w-full max-w-md animate-slide-up rounded-card border border-paper-200/70 bg-surface p-6 shadow-soft sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-khata-100 text-khata-700">
            <LockKeyhole size={28} aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">Verify OTP</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            We've sent a 6-digit code to +91 {phone}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-display text-sm font-bold text-gray-900" htmlFor="khata-otp">
              Enter OTP
            </label>
            <input
              id="khata-otp"
              type="text"
              placeholder="6 digit code"
              className={cn(
                khataInputClass,
                "text-center font-display text-lg font-bold tracking-[0.5em] tabular-nums"
              )}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center rounded-button border border-paper-300 bg-surface font-display text-sm font-bold text-gray-800 transition-all duration-200 hover:border-paper-400 hover:bg-paper-50 active:scale-[0.98]"
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="submit"
              className="flex h-12 flex-1 items-center justify-center rounded-button bg-khata-600 font-display text-sm font-bold text-khata-50 shadow-[0_4px_14px_-4px_rgb(115_38_29/0.55)] transition-all duration-200 hover:bg-khata-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              disabled={otp.length !== 6}
            >
              Verify
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-sm font-bold text-khata-700 transition-colors hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-sm tabular-nums text-gray-600">
              Resend OTP in {timer} seconds
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
