"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, Mail, User } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PhoneInput } from "../components/auth/PhoneInput";
import { Button } from "../components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      router.push(`/verify-otp?phone=${phone}`);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start shopping in minutes">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="relative mt-1.5">
            <User
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="h-12 w-full rounded-button border border-gray-200 bg-white pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <PhoneInput value={phone} onChange={setPhone} />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <div className="relative mt-1.5">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="h-12 w-full rounded-button border border-gray-200 bg-white pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={phone.length !== 10}>
          Continue
          <ArrowRight size={16} />
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#F8F9FA] px-3 text-gray-400">or</span>
          </div>
        </div>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-button border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Globe size={18} />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
