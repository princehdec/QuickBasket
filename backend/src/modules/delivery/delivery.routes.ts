import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/authenticate";
import { partnerOnly } from "../../shared/middleware/authorize";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { DeliveryRepository } from "./delivery.repository";

const router: Router = Router();
const repo = new DeliveryRepository();
const jobStatusSchema = z.object({
  status: z.enum(["accepted", "picked_up", "out_for_delivery", "delivered", "failed"]),
  proofOfDeliveryUrl: z.string().url().optional(),
});

router.use(authenticate, partnerOnly);

router.get("/me", asyncHandler(async (req: Request, res: Response) => {
  const partner = await repo.findPartnerByUserId(req.user!.sub);
  sendSuccess(res, partner ?? null, "Partner profile retrieved");
}));

router.patch("/me/online", asyncHandler(async (req: Request, res: Response) => {
  const isOnline = z.object({ isOnline: z.boolean() }).parse(req.body).isOnline;
  const partner = await repo.setOnlineStatus(req.user!.sub, isOnline);
  sendSuccess(res, partner ?? null, "Partner availability updated");
}));

router.get("/jobs", asyncHandler(async (req: Request, res: Response) => {
  const jobs = await repo.listJobs(req.user!.sub);
  sendSuccess(res, jobs, "Delivery jobs retrieved");
}));

router.patch("/jobs/:id", asyncHandler(async (req: Request, res: Response) => {
  const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const input = jobStatusSchema.parse(req.body);
  if (!jobId) throw new Error("Delivery job id is required");
  const job = await repo.updateJob(req.user!.sub, jobId, input.status, input.proofOfDeliveryUrl);
  if (!job) {
    res.status(404);
    sendSuccess(res, null, "Delivery job not found");
    return;
  }
  sendSuccess(res, job, "Delivery job updated");
}));

export default router;
