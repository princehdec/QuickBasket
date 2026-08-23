import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { OrdersService } from "./orders.service";
import type { CreateOrderDTO } from "./orders.dto";

const service = new OrdersService();

export const create = asyncHandler(async (req: Request, res: Response) => {
  const order = await service.create(req.user!.sub, req.body as CreateOrderDTO);
  sendSuccess(res, order, "Order created", 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const orders = await service.list(req.user!.sub);
  sendSuccess(res, orders, "Orders retrieved");
});

export const get = asyncHandler(async (req: Request, res: Response) => {
  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!orderId) {
    throw new Error("Order id is required");
  }
  const order = await service.get(req.user!.sub, orderId);
  sendSuccess(res, order, "Order retrieved");
});

export const vendorList = asyncHandler(async (req: Request, res: Response) => {
  const orders = await service.listForVendor(req.user!.sub);
  sendSuccess(res, orders, "Vendor orders retrieved");
});

export const vendorUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const allowed = ["confirmed", "preparing", "packed", "cancelled"] as const;
  const status = req.body.status as (typeof allowed)[number];
  if (!orderId || !allowed.includes(status)) {
    throw new Error("Invalid vendor order status update");
  }
  const order = await service.updateForVendor(req.user!.sub, orderId, status);
  sendSuccess(res, order, "Vendor order status updated");
});
