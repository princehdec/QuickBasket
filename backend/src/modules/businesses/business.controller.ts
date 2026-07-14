import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { BusinessService } from "./business.service";
import type { CreateBusinessDTO, UpdateBusinessDTO } from "./business.dto";

const service = new BusinessService();

export const create = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as CreateBusinessDTO;
    const result = await service.create(req.user!.sub, dto);
    sendSuccess(res, result, "Business created", 201);
  }
);

export const getAll = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await service.getAll(req.query as unknown as {
      city?: string;
      businessType?: string;
      search?: string;
      page: number;
      limit: number;
    });
    sendSuccess(res, result, "Businesses retrieved");
  }
);

export const getMyBusinesses = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await service.getMyBusinesses(req.user!.sub);
    sendSuccess(res, result, "Businesses retrieved");
  }
);

export const getById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await service.getById(req.params.id as string);
    sendSuccess(res, result, "Business retrieved");
  }
);

export const update = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as UpdateBusinessDTO;
    const result = await service.update(req.user!.sub, req.params.id as string, dto);
    sendSuccess(res, result, "Business updated");
  }
);

export const remove = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    await service.delete(req.user!.sub, req.params.id as string);
    sendSuccess(res, null, "Business deleted");
  }
);
