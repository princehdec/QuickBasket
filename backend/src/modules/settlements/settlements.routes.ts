import { Router, type Request, type Response } from "express";
import { and, eq } from "drizzle-orm";
import { authenticate } from "../../shared/middleware/authenticate";
import { operationsOnly, vendorOnly } from "../../shared/middleware/authorize";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { db } from "../../shared/db/index";
import { businesses, settlementBatches } from "../../shared/schema/index";

const router: Router = Router();

router.get("/me", authenticate, vendorOnly, asyncHandler(async (req: Request, res: Response) => {
  const rows = await db
    .select({ settlement: settlementBatches })
    .from(settlementBatches)
    .innerJoin(businesses, eq(settlementBatches.businessId, businesses.id))
    .where(eq(businesses.ownerId, req.user!.sub));
  sendSuccess(res, rows.map((row) => row.settlement), "Vendor settlements retrieved");
}));

router.get("/admin", authenticate, operationsOnly, asyncHandler(async (_req: Request, res: Response) => {
  const rows = await db.select().from(settlementBatches);
  sendSuccess(res, rows, "Settlement queue retrieved");
}));

router.patch("/admin/:id/approve", authenticate, operationsOnly, asyncHandler(async (req: Request, res: Response) => {
  const settlementId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!settlementId) throw new Error("Settlement id is required");
  const [updated] = await db
    .update(settlementBatches)
    .set({ status: "approved", updatedAt: new Date() })
    .where(and(eq(settlementBatches.id, settlementId), eq(settlementBatches.status, "draft")))
    .returning();
  sendSuccess(res, updated ?? null, updated ? "Settlement approved" : "Settlement not found or already processed");
}));

export default router;
