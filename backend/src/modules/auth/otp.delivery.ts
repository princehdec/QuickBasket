import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../../shared/config/env";

export interface OtpDelivery {
  send(phone: string, code: string): Promise<void>;
}

export class ConsoleOtpDelivery implements OtpDelivery {
  async send(_phone: string, _code: string): Promise<void> {
    if (env.NODE_ENV === "production") {
      throw new Error("OTP delivery provider is not configured for production");
    }

    console.info(
      "[OTP development delivery] code redacted; use an explicitly enabled test channel when needed",
    );
  }
}

function requireEmailConfig(): {
  from: string;
  to: string;
  host: string;
  port: number;
  user: string;
  password: string;
} {
  const from = env.OTP_EMAIL_FROM;
  const to = env.OTP_EMAIL_TO;
  const host = env.SMTP_HOST;
  const port = env.SMTP_PORT;
  const user = env.SMTP_USER;
  const password = env.SMTP_PASSWORD;
  const missing: string[] = [];

  if (!from) missing.push("OTP_EMAIL_FROM");
  if (!to) missing.push("OTP_EMAIL_TO");
  if (!host) missing.push("SMTP_HOST");
  if (!port) missing.push("SMTP_PORT");
  if (!user) missing.push("SMTP_USER");
  if (!password) missing.push("SMTP_PASSWORD");

  if (missing.length > 0) {
    throw new Error(`Email OTP provider is not configured: missing ${missing.join(", ")}`);
  }

  return {
    from: from!,
    to: to!,
    host: host!,
    port: port!,
    user: user!,
    password: password!,
  };
}

export class FixedInboxEmailOtpDelivery implements OtpDelivery {
  private readonly config = requireEmailConfig();
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.port === 465,
      auth: {
        user: this.config.user,
        pass: this.config.password,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });
  }

  async send(phone: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.from,
      to: this.config.to,
      subject: "QuickBasket login OTP / लॉगिन OTP",
      text: [
        "Your QuickBasket test login code is valid for 5 minutes.",
        "आपका QuickBasket परीक्षण लॉगिन कोड 5 मिनट के लिए मान्य है।",
        "",
        `OTP: ${code}`,
        "",
        `Test phone: ${phone}`,
        "Do not forward this email. / इस ईमेल को आगे साझा न करें।",
      ].join("\n"),
    });
  }
}

export function createOtpDelivery(): OtpDelivery {
  if (env.OTP_PROVIDER === "email") {
    return new FixedInboxEmailOtpDelivery();
  }

  return new ConsoleOtpDelivery();
}
