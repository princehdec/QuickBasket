import type { ServiceabilityQuote } from "@quickbasket/types";

export interface ApiErrorShape {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | undefined | Promise<string | undefined>;
  onUnauthorized?: () => void | Promise<void>;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly details?: ApiErrorShape;

  constructor(status: number, details: ApiErrorShape) {
    super(details.message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getAccessToken?: ApiClientOptions["getAccessToken"];
  private readonly onUnauthorized?: ApiClientOptions["onUnauthorized"];

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.getAccessToken = options.getAccessToken;
    this.onUnauthorized = options.onUnauthorized;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken?.();
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");

    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    const body = (await response.json().catch(() => null)) as
      | { data?: T; error?: ApiErrorShape; message?: string }
      | null;

    if (!response.ok) {
      if (response.status === 401) {
        await this.onUnauthorized?.();
      }

      throw new ApiClientError(response.status, {
        message: body?.error?.message ?? body?.message ?? "Request failed",
        code: body?.error?.code,
        fieldErrors: body?.error?.fieldErrors,
      });
    }

    return (body?.data ?? body) as T;
  }

  sendOtp(phone: string) {
    return this.request<{ challengeId: string; expiresAt: string }>("/api/v1/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  verifyOtp(phone: string, otp: string, challengeId?: string) {
    return this.request<{ accessToken: string; refreshToken: string; user: unknown }>(
      "/api/v1/auth/otp/verify",
      {
        method: "POST",
        body: JSON.stringify({ phone, otp, challengeId }),
      },
    );
  }

  getServiceability(addressId: string, businessId: string) {
    return this.request<ServiceabilityQuote>(
      `/api/v1/serviceability/quote?addressId=${encodeURIComponent(addressId)}&businessId=${encodeURIComponent(businessId)}`,
    );
  }
}
