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
