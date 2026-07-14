import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "admin",
  "business_owner",
  "delivery_partner",
]);

export const businessTypeEnum = pgEnum("business_type", [
  "GROCERY",
  "FOOD",
  "PHARMACY",
  "ELECTRONICS",
  "PLUMBER",
  "FASHION",
  "BEAUTY",
  "PETS",
  "FLOWERS",
  "STATIONERY",
  "LAUNDRY",
  "PORTER",
  "OTHER",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "placed",
  "confirmed",
  "preparing",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "upi",
  "credit_card",
  "debit_card",
  "cod",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const paymentGatewayEnum = pgEnum("payment_gateway", [
  "razorpay",
  "stripe",
  "cashfree",
]);

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "flat",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "order_update",
  "offer",
  "system",
  "payment",
]);
