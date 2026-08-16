"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PhoneInput } from "../components/auth/PhoneInput";
import { Button } from "../components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      router.push(`/verify-otp?phone=${phone}`);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Enter your phone number to continue">
      <form onSubmit={handleSubmit} className="space-y-5">
        <PhoneInput value={phone} onChange={setPhone} />

        <Button type="submit" size="lg" className="w-full" disabled={phone.length !== 10}>
          Continue with OTP
          <ArrowRight size={16} />
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-paper-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 font-semibold tracking-[0.12em] text-paper-500">or</span>
          </div>
        </div>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-button border border-paper-300 bg-surface text-sm font-bold text-gray-800 transition-all hover:border-paper-400 hover:bg-paper-50 active:scale-[0.99]"
        >
          <Globe size={18} />
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <Link href="#" className="font-bold text-brand-700 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-bold text-brand-700 hover:underline">
            Privacy Policy
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-brand-700 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
