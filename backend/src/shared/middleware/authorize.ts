import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export type AppRole =
  | "customer"
  | "admin"
  | "city_manager"
  | "support_agent"
  | "finance_operator"
  | "catalog_operator"
  | "business_owner"
  | "vendor_staff"
  | "delivery_partner";

export function authorize(...roles: AppRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role as AppRole)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }

    next();
  };
}

export const vendorOnly = authorize("business_owner", "vendor_staff", "admin");
export const partnerOnly = authorize("delivery_partner", "admin");
export const operationsOnly = authorize(
  "admin",
  "city_manager",
  "support_agent",
  "finance_operator",
  "catalog_operator",
);
