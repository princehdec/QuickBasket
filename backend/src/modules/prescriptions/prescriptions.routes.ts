import { Router, type Request, type Response } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { operationsOnly } from "../../shared/middleware/authorize";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { ApiError } from "../../shared/utils/apiError";
import { PrescriptionsService } from "./prescriptions.service";
import {
  createPrescriptionSubmissionSchema,
  prescriptionSubmissionIdSchema,
  reviewPrescriptionSubmissionSchema,
} from "./prescriptions.validation";

const router: Router = Router();
const service = new PrescriptionsService();

router.post(
  "/submissions",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const input = createPrescriptionSubmissionSchema.parse(req.body);
    const submission = await service.submit(req.user!.sub, input);
    sendSuccess(res, submission, "Prescription submitted for review", 201);
  }),
);

router.get(
  "/submissions",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const submissions = await service.listForCustomer(req.user!.sub);
    sendSuccess(res, submissions, "Prescription submissions retrieved");
  }),
);

router.get(
  "/submissions/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = prescriptionSubmissionIdSchema.parse(req.params);
    const submission = await service.getForCustomer(req.user!.sub, id);
    if (!submission) throw ApiError.notFound("Prescription submission not found");
    sendSuccess(res, submission, "Prescription submission retrieved");
  }),
);

router.get(
  "/admin",
  authenticate,
  operationsOnly,
  asyncHandler(async (_req: Request, res: Response) => {
    const submissions = await service.listReviewQueue();
    sendSuccess(res, submissions, "Prescription review queue retrieved");
  }),
);

router.patch(
  "/admin/:id",
  authenticate,
  operationsOnly,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = prescriptionSubmissionIdSchema.parse(req.params);
    const input = reviewPrescriptionSubmissionSchema.parse(req.body);
    const submission = await service.review(req.user!.sub, id, input);
    if (!submission) throw ApiError.notFound("Prescription submission not found");
    sendSuccess(res, submission, "Prescription review updated");
  }),
);

export default router;
