import { Router, type Request, type Response } from "express";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/authenticate";
import { operationsOnly } from "../../shared/middleware/authorize";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { db } from "../../shared/db/index";
import { orders, prescriptionReviews } from "../../shared/schema/index";

const router: Router = Router();
const submitSchema = z.object({ orderId: z.string().uuid(), documentUrl: z.string().url() });
const reviewSchema = z.object({ status: z.enum(["approved", "rejected"]), rejectionReason: z.string().max(500).optional() });

router.post("/", authenticate, asyncHandler(async (req: Request, res: Response) => {
  const input = submitSchema.parse(req.body);
  const [order] = await db.select().from(orders).where(and(eq(orders.id, input.orderId), eq(orders.userId, req.user!.sub))).limit(1);
  if (!order) { res.status(404); sendSuccess(res, null, "Order not found"); return; }
  const [review] = await db.insert(prescriptionReviews).values({ orderId: input.orderId, customerId: req.user!.sub, documentUrl: input.documentUrl }).returning();
  sendSuccess(res, review, "Prescription submitted", 201);
}));

router.get("/admin", authenticate, operationsOnly, asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await db.select().from(prescriptionReviews);
  sendSuccess(res, reviews, "Prescription review queue retrieved");
}));

router.patch("/admin/:id", authenticate, operationsOnly, asyncHandler(async (req: Request, res: Response) => {
  const reviewId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const input = reviewSchema.parse(req.body);
  if (!reviewId) throw new Error("Prescription review id is required");
  const [updated] = await db.update(prescriptionReviews).set({ status: input.status, rejectionReason: input.rejectionReason, reviewerId: req.user!.sub, reviewedAt: new Date(), updatedAt: new Date() }).where(eq(prescriptionReviews.id, reviewId)).returning();
  sendSuccess(res, updated ?? null, updated ? "Prescription review updated" : "Prescription review not found");
}));

export default router;
