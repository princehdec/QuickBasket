export type SupportedLanguage = "en" | "hi";

export type UserRole =
  | "customer"
  | "admin"
  | "city_manager"
  | "support_agent"
  | "finance_operator"
  | "catalog_operator"
  | "business_owner"
  | "vendor_staff"
  | "delivery_partner";

export type BusinessType =
  | "GROCERY"
  | "FOOD"
  | "PHARMACY"
  | "ELECTRONICS"
  | "STATIONERY"
  | "LAUNDRY"
  | "BAKERY"
  | "FASHION"
  | "SMALL_SHOP"
  | "PORTER"
  | "OTHER";

export type OrderStatus =
  | "draft"
  | "payment_pending"
  | "placed"
  | "accepted"
  | "preparing"
  | "ready_for_pickup"
  | "assigned"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refund_pending"
  | "refunded";

export type PaymentMethod = "upi" | "credit_card" | "debit_card" | "net_banking" | "wallet";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type DeliveryPartnerSource = "managed" | "third_party";
export type PrescriptionStatus = "not_required" | "pending_review" | "approved" | "rejected";

export interface City {
  id: string;
  name: string;
  state: string;
  isActive: boolean;
}

export interface ServiceZone {
  id: string;
  cityId: string;
  name: string;
  radiusKm: number;
  isActive: boolean;
}

export interface ServiceabilityQuote {
  serviceable: boolean;
  cityId: string;
  serviceZoneId?: string;
  distanceKm?: number;
  deliveryFee?: number;
  estimatedMinutes?: number;
  reason?: "outside_zone" | "business_closed" | "partner_unavailable" | "address_invalid";
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  cityId: string;
  businessId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  grandTotal: number;
  prescriptionStatus: PrescriptionStatus;
  createdAt: string;
}

export interface DeliveryJob {
  id: string;
  orderId: string;
  partnerId?: string;
  partnerSource?: DeliveryPartnerSource;
  status: "unassigned" | "offered" | "accepted" | "picked_up" | "delivered" | "failed" | "reassigned";
  pickupAt?: string;
  deliveredAt?: string;
}

export interface SettlementBatch {
  id: string;
  businessId: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  commissionAmount: number;
  refundAmount: number;
  adjustmentAmount: number;
  netAmount: number;
  status: "draft" | "approved" | "processing" | "paid" | "failed";
}
