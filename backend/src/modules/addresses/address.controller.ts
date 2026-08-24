import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { AddressService } from "./address.service";
import type { CreateAddressDTO, UpdateAddressDTO } from "./address.dto";

const service = new AddressService();

export const list = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await service.list(req.user!.sub);
  sendSuccess(res, result, "Addresses retrieved");
});

export const create = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await service.create(req.user!.sub, req.body as CreateAddressDTO);
  sendSuccess(res, result, "Address created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await service.update(req.user!.sub, req.params.id as string, req.body as UpdateAddressDTO);
  sendSuccess(res, result, "Address updated");
});

export const remove = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  await service.remove(req.user!.sub, req.params.id as string);
  sendSuccess(res, null, "Address deleted");
});
