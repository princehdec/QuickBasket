import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/authenticate";
import { operationsOnly } from "../../shared/middleware/authorize";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { DeliveryRepository } from "./delivery.repository";

const router: Router = Router();
const repo = new DeliveryRepository();
const assignSchema = z.object({
  orderId: z.string().uuid(),
  partnerId: z.string().uuid().optional(),
  source: z.enum(["managed", "third_party"]),
  earnings: z.number().min(0),
});

router.use(authenticate, operationsOnly);

router.get("/jobs", asyncHandler(async (_req: Request, res: Response) => {
  const jobs = await repo.listAllJobs();
  sendSuccess(res, jobs, "All delivery jobs retrieved");
}));

router.post("/jobs/assign", asyncHandler(async (req: Request, res: Response) => {
  const input = assignSchema.parse(req.body);
  const job = await repo.assignJob(input);
  sendSuccess(res, job, "Delivery job assigned", 201);
}));

export default router;
