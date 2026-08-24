export interface OtpDelivery {
  send(phone: string, code: string): Promise<void>;
}

export class ConsoleOtpDelivery implements OtpDelivery {
  async send(_phone: string, _code: string): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("OTP delivery provider is not configured for production");
    }

    console.info("[OTP development delivery] code redacted; use an explicitly enabled test channel when needed");
  }
}
