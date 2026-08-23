export type OnlinePaymentMethod = "upi" | "credit_card" | "debit_card" | "net_banking" | "wallet";

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: "INR";
  method: OnlinePaymentMethod;
}

export interface PaymentSession {
  provider: string;
  gatewayOrderId: string;
  checkoutPayload: Record<string, string>;
}

export interface PaymentGateway {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  verifyWebhook(signature: string, rawBody: string): boolean;
}

export class UnconfiguredPaymentGateway implements PaymentGateway {
  async createPayment(_input: CreatePaymentInput): Promise<PaymentSession> {
    throw new Error("Online payment gateway is not configured");
  }

  verifyWebhook(_signature: string, _rawBody: string): boolean {
    return false;
  }
}
