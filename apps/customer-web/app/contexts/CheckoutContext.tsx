"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Location } from "../context/LocationContext";

export type PaymentMethod = "upi" | "credit_card" | "debit_card" | "net_banking" | "wallet";
export type DeliveryOption = "asap" | "scheduled";

export type Coupon = {
  code: string;
  label: string;
  description: string;
  discount: (subtotal: number) => number;
};

export const validCoupons: Coupon[] = [
  {
    code: "WELCOME20",
    label: "20% OFF",
    description: "20% off on your order (max ₹100)",
    discount: (s) => Math.min(Math.round(s * 0.2), 100),
  },
  {
    code: "SAVE50",
    label: "₹50 OFF",
    description: "Flat ₹50 discount on all orders",
    discount: () => 50,
  },
  {
    code: "FREEDELIVERY",
    label: "Free Delivery",
    description: "No delivery fee charged",
    discount: () => 20,
  },
];

export const mockAddresses: Location[] = [
  {
    id: "addr-1",
    label: "Home",
    address: "123, Main Street, Sector 14",
    city: "Lucknow",
    pincode: "122001",
  },
  {
    id: "addr-2",
    label: "Work",
    address: "456, Cyber Hub, DLF Phase 2",
    city: "Lucknow",
    pincode: "122002",
  },
  {
    id: "addr-3",
    label: "Other",
    address: "789, MG Road",
    city: "Lucknow",
    pincode: "122003",
  },
];

export type OrderInfo = {
  orderId: string;
  estimatedDelivery: string;
};

type CheckoutContextType = {
  selectedAddress: Location | null;
  deliveryOption: DeliveryOption;
  scheduledDate: string;
  paymentMethod: PaymentMethod | null;
  couponCode: string;
  couponDiscount: number;
  couponError: string;
  couponApplied: boolean;
  orderNotes: string;
  lastOrder: OrderInfo | null;
  setAddress: (address: Location) => void;
  setDeliveryOption: (option: DeliveryOption) => void;
  setScheduledDate: (date: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setOrderNotes: (notes: string) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  setLastOrder: (order: OrderInfo) => void;
  canPlaceOrder: boolean;
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "QB";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [selectedAddress, setSelectedAddress] = useState<Location | null>(mockAddresses[0]);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("asap");
  const [scheduledDate, setScheduledDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [lastOrder, setLastOrderState] = useState<OrderInfo | null>(null);

  const setAddress = useCallback((address: Location) => {
    setSelectedAddress(address);
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const coupon = validCoupons.find(
        (c) => c.code.toLowerCase() === code.trim().toLowerCase()
      );
      if (coupon) {
        setCouponCode(coupon.code);
        setCouponDiscount(coupon.discount(0));
        setCouponError("");
        setCouponApplied(true);
      } else {
        setCouponError("Invalid coupon code");
        setCouponDiscount(0);
        setCouponApplied(false);
      }
    },
    []
  );

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError("");
    setCouponApplied(false);
  }, []);

  const setLastOrder = useCallback((order: OrderInfo) => {
    setLastOrderState(order);
  }, []);

  const canPlaceOrder = !!selectedAddress && !!paymentMethod;

  const value = useMemo(
    () => ({
      selectedAddress,
      deliveryOption,
      scheduledDate,
      paymentMethod,
      couponCode,
      couponDiscount,
      couponError,
      couponApplied,
      orderNotes,
      lastOrder,
      setAddress,
      setDeliveryOption,
      setScheduledDate,
      setPaymentMethod,
      setOrderNotes,
      applyCoupon,
      removeCoupon,
      setLastOrder,
      canPlaceOrder,
    }),
    [
      selectedAddress,
      deliveryOption,
      scheduledDate,
      paymentMethod,
      couponCode,
      couponDiscount,
      couponError,
      couponApplied,
      orderNotes,
      lastOrder,
      setAddress,
      setDeliveryOption,
      setScheduledDate,
      setPaymentMethod,
      setOrderNotes,
      applyCoupon,
      removeCoupon,
      setLastOrder,
      canPlaceOrder,
    ]
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
