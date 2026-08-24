"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createAddress,
  listAddresses,
  type CreateCustomerAddressInput,
  type CustomerAddress,
} from "../../lib/api";

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

export type OrderInfo = {
  orderId: string;
  estimatedDelivery: string;
};

type CheckoutContextType = {
  addresses: CustomerAddress[];
  selectedAddress: CustomerAddress | null;
  addressesLoading: boolean;
  addressesError: string;
  deliveryOption: DeliveryOption;
  scheduledDate: string;
  paymentMethod: PaymentMethod | null;
  couponCode: string;
  couponDiscount: number;
  couponError: string;
  couponApplied: boolean;
  orderNotes: string;
  lastOrder: OrderInfo | null;
  setAddress: (address: CustomerAddress) => void;
  addAddress: (input: CreateCustomerAddressInput) => Promise<CustomerAddress>;
  refreshAddresses: () => Promise<void>;
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

function hasAccessToken(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage.getItem("qb_access_token"));
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("asap");
  const [scheduledDate, setScheduledDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [lastOrder, setLastOrderState] = useState<OrderInfo | null>(null);

  const refreshAddresses = useCallback(async () => {
    if (!hasAccessToken()) {
      setAddresses([]);
      setSelectedAddress(null);
      setAddressesError("Please sign in to add a delivery address");
      setAddressesLoading(false);
      return;
    }

    setAddressesLoading(true);
    setAddressesError("");
    try {
      const nextAddresses = await listAddresses();
      setAddresses(nextAddresses);
      setSelectedAddress((current) => {
        const stillAvailable = current && nextAddresses.find((address) => address.id === current.id);
        return stillAvailable ?? nextAddresses.find((address) => address.isDefault) ?? nextAddresses[0] ?? null;
      });
    } catch (error) {
      setAddressesError(error instanceof Error ? error.message : "Unable to load delivery addresses");
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAddresses();
  }, [refreshAddresses]);

  const setAddress = useCallback((address: CustomerAddress) => {
    setSelectedAddress(address);
  }, []);

  const addAddress = useCallback(async (input: CreateCustomerAddressInput) => {
    setAddressesError("");
    try {
      const created = await createAddress(input);
      setAddresses((current) => [created, ...current.filter((address) => address.id !== created.id)]);
      setSelectedAddress(created);
      return created;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save delivery address";
      setAddressesError(message);
      throw error;
    }
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
      addresses,
      selectedAddress,
      addressesLoading,
      addressesError,
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
      addAddress,
      refreshAddresses,
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
      addresses,
      selectedAddress,
      addressesLoading,
      addressesError,
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
      addAddress,
      refreshAddresses,
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
