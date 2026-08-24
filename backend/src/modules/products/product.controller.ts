import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { ProductService } from "./product.service";
import type { CreateProductDTO, UpdateProductDTO } from "./product.dto";

const service = new ProductService();

export const create = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as CreateProductDTO;
    const result = await service.create(req.user!.sub, dto);
    sendSuccess(res, result, "Product created", 201);
  }
);

export const getAll = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await service.getAll(
      req.query as unknown as {
        businessId?: string;
        categoryId?: string;
        isAvailable?: boolean;
        search?: string;
        page: number;
        limit: number;
      }
    );
    sendSuccess(res, result, "Products retrieved");
  }
);

export const getById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await service.getById(req.params.id as string);
    sendSuccess(res, result, "Product retrieved");
  }
);

export const update = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as UpdateProductDTO;
    const result = await service.update(
      req.user!.sub,
      req.params.id as string,
      dto
    );
    sendSuccess(res, result, "Product updated");
  }
);

export const remove = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    await service.delete(req.user!.sub, req.params.id as string);
    sendSuccess(res, null, "Product deleted");
  }
);
