"use client";

import { useState } from "react";
import { PhoneEntry } from "./screens/PhoneEntry";
import { OTPVerification } from "./screens/OTPVerification";
import { KhataHome } from "./screens/KhataHome";
import { LinkShop } from "./screens/LinkShop";
import { KhataDetailsCustomer } from "./screens/KhataDetailsCustomer";
import { ShopOwnerManagement } from "./screens/ShopOwnerManagement";
import { ReviewRequest } from "./screens/ReviewRequest";
import { CustomerKhataDetail } from "./screens/CustomerKhataDetail";
import { LogPurchase } from "./screens/LogPurchase";
import { LogRepayment } from "./screens/LogRepayment";

export default function KhataPage() {
  const [currentScreen, setCurrentScreen] = useState<
    | "phoneEntry"
    | "otpVerification"
    | "khataHome"
    | "linkShop"
    | "khataDetailsCustomer"
    | "shopOwnerManagement"
    | "reviewRequest"
    | "customerKhataDetail"
    | "logPurchase"
    | "logRepayment"
  >("phoneEntry");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [currentCustomer, setCurrentCustomer] = useState<{
    id: string;
    name: string;
    phone: string;
    balance?: number;
  } | null>(null);

  // Navigation handlers
  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentScreen("otpVerification");
  };

  const handleOTPVerify = (otp: string) => {
    // In a real app, verify OTP here
    setCurrentScreen("khataHome");
  };

  const handleRequestKhata = (shopPhone: string) => {
    setShopPhone(shopPhone);
    // In a real app, send request here
    setCurrentScreen("khataHome");
  };

  const handleViewCustomer = (customer: { id: string; name: string; phone: string; balance?: number }) => {
    setCurrentCustomer(customer);
    setCurrentScreen("customerKhataDetail");
  };

  const handleLogPurchase = (customer: { id: string; name: string; phone: string }) => {
    setCurrentCustomer(customer);
    setCurrentScreen("logPurchase");
  };

  const handleLogRepayment = (customer: { id: string; name: string; phone: string; balance: number }) => {
    setCurrentCustomer(customer);
    setCurrentScreen("logRepayment");
  };

  // Render the appropriate screen based on current state
  switch (currentScreen) {
    case "phoneEntry":
      return <PhoneEntry onNext={handlePhoneSubmit} />;
    case "otpVerification":
      return (
        <OTPVerification
          phone={phoneNumber}
          onVerify={handleOTPVerify}
          onResend={() => {}}
          onBack={() => setCurrentScreen("phoneEntry")}
        />
      );
    case "khataHome":
      return (
        <KhataHome
          onLinkShop={() => setCurrentScreen("linkShop")}
          onViewShop={() => setCurrentScreen("shopOwnerManagement")}
          onViewCustomer={() => setCurrentScreen("khataDetailsCustomer")}
        />
      );
    case "linkShop":
      return (
        <LinkShop
          onRequestKhata={handleRequestKhata}
          onBack={() => setCurrentScreen("khataHome")}
        />
      );
    case "khataDetailsCustomer":
      return <KhataDetailsCustomer />;
    case "shopOwnerManagement":
      return (
        <ShopOwnerManagement
          onReviewRequest={() => setCurrentScreen("reviewRequest")}
          onViewCustomer={handleViewCustomer}
          onLogPurchase={handleLogPurchase}
        />
      );
    case "reviewRequest":
      return <ReviewRequest onBack={() => setCurrentScreen("shopOwnerManagement")} />;
    case "customerKhataDetail":
      return currentCustomer ? (
        <CustomerKhataDetail onLogRepayment={() => handleLogRepayment({
          id: currentCustomer.id,
          name: currentCustomer.name,
          phone: currentCustomer.phone,
          balance: currentCustomer.balance ?? 0,
        })} />
      ) : (
        <CustomerKhataDetail />
      );
    case "logPurchase":
      return currentCustomer ? (
        <LogPurchase
          customer={currentCustomer}
          onBack={() => setCurrentScreen("shopOwnerManagement")}
          onSubmit={(data) => {
            // In a real app, submit data here
            setCurrentScreen("shopOwnerManagement");
          }}
        />
      ) : (
        <KhataHome />
      );
    case "logRepayment":
      return currentCustomer ? (
        <LogRepayment
          customer={{ ...currentCustomer, balance: currentCustomer.balance || 0 }}
          onBack={() => setCurrentScreen("shopOwnerManagement")}
          onSubmit={(data) => {
            // In a real app, submit data here
            setCurrentScreen("shopOwnerManagement");
          }}
        />
      ) : (
        <KhataHome />
      );
    default:
      return <KhataHome />;
  }
}