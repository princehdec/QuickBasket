import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { validate } from "../../shared/middleware/validate";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { quoteServiceability } from "./serviceability.service";

const router: Router = Router();

const quoteSchema = z.object({
  addressId: z.string().uuid(),
  businessId: z.string().uuid(),
});

router.get(
  "/quote",
  validate(quoteSchema, "query"),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as z.infer<typeof quoteSchema>;
    const quote = await quoteServiceability(query.addressId, query.businessId);
    sendSuccess(res, quote, "Serviceability calculated");
  }),
);

export default router;
