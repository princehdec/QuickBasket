"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { useLang } from "../i18n/LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLang();
  return (
    <AuthLayout title={t("Forgot Password")} subtitle={t("We'll help you reset your password")}>
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-turmeric-100 text-turmeric-700">
          <Construction size={28} aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-gray-600">
          {t("Password reset is coming soon. Stay tuned!")}
        </p>
        <Link href="/login">
          <Button variant="outline" size="md">
            <ArrowLeft size={16} aria-hidden="true" />
            {t("Back to Login")}
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
