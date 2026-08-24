import crypto from "node:crypto";
import { env } from "../../shared/config/env";

export type OnlinePaymentMethod = "upi" | "credit_card" | "debit_card" | "net_banking" | "wallet";

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: "INR";
  method: OnlinePaymentMethod;
}

export interface PaymentSession {
  provider: "razorpay";
  gatewayOrderId: string;
  checkoutPayload: Record<string, string>;
}

export interface PaymentGateway {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  verifyWebhook(signature: string, rawBody: string): boolean;
}

export class RazorpayGateway implements PaymentGateway {
  private readonly endpoint = "https://api.razorpay.com/v1/orders";

  private assertConfigured(): { keyId: string; keySecret: string } {
    if (env.PAYMENT_PROVIDER !== "razorpay" || !env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay is not configured");
    }
    return { keyId: env.RAZORPAY_KEY_ID, keySecret: env.RAZORPAY_KEY_SECRET };
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    const { keyId, keySecret } = this.assertConfigured();
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: Math.round(input.amount * 100), currency: input.currency, receipt: input.orderId, notes: { quickbasketOrderId: input.orderId, method: input.method } }),
    });
    const body = await response.json() as { id?: string; error?: { description?: string } };
    if (!response.ok || !body.id) throw new Error(body.error?.description ?? "Razorpay order creation failed");
    return { provider: "razorpay", gatewayOrderId: body.id, checkoutPayload: { keyId, orderId: body.id, amount: String(Math.round(input.amount * 100)), currency: input.currency } };
  }

  verifyCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
    const { keySecret } = this.assertConfigured();
    const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    const expectedBuffer = Buffer.from(expected);
    const signatureBuffer = Buffer.from(signature);
    return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  }

  verifyWebhook(signature: string, rawBody: string): boolean {
    if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
    const expected = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
    const expectedBuffer = Buffer.from(expected);
    const signatureBuffer = Buffer.from(signature);
    return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  }
}

export class UnconfiguredPaymentGateway implements PaymentGateway {
  verifyCheckoutSignature(_orderId: string, _paymentId: string, _signature: string): boolean { return false; }
  async createPayment(_input: CreatePaymentInput): Promise<PaymentSession> { throw new Error("Online payment gateway is not configured"); }
  verifyWebhook(_signature: string, _rawBody: string): boolean { return false; }
}

export function getPaymentGateway(): PaymentGateway {
  return env.PAYMENT_PROVIDER === "razorpay" ? new RazorpayGateway() : new UnconfiguredPaymentGateway();
}
