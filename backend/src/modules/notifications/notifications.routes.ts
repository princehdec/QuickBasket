import { Router, type Request, type Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/authenticate";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { db } from "../../shared/db/index";
import { notifications } from "../../shared/schema/index";

const router: Router = Router();
const querySchema = z.object({
  unreadOnly: z.string().transform((value) => value === "true").optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

router.get("/", authenticate, asyncHandler(async (req: Request, res: Response) => {
  const query = querySchema.parse(req.query);
  const conditions = [eq(notifications.userId, req.user!.sub)];
  if (query.unreadOnly) conditions.push(eq(notifications.isRead, false));
  const items = await db.select().from(notifications).where(and(...conditions)).orderBy(desc(notifications.createdAt)).limit(query.limit);
  sendSuccess(res, items, "Notifications retrieved");
}));

router.patch("/:id/read", authenticate, asyncHandler(async (req: Request, res: Response) => {
  const notificationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!notificationId) { sendSuccess(res, null, "Notification id is required", 400); return; }
  const [updated] = await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.id, notificationId), eq(notifications.userId, req.user!.sub))).returning();
  if (!updated) { sendSuccess(res, null, "Notification not found", 404); return; }
  sendSuccess(res, updated, "Notification marked as read");
}));

export default router;
