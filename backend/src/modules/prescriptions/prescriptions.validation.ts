import { z } from "zod";

const prescriptionItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
});

export const createPrescriptionSubmissionSchema = z.object({
  businessId: z.string().uuid(),
  items: z.array(prescriptionItemSchema).min(1).max(50),
  // The upload service must mint this key under prescriptions/{customerId}/.
  documentKey: z.string().trim().min(1).max(512),
  documentFileName: z.string().trim().min(1).max(255),
  documentMimeType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
  documentSizeBytes: z.number().int().min(1).max(10_000_000),
});

export const prescriptionSubmissionIdSchema = z.object({
  id: z.string().uuid(),
});

export const reviewPrescriptionSubmissionSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().trim().max(500).optional(),
  })
  .superRefine((input, ctx) => {
    if (input.status === "rejected" && !input.rejectionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rejectionReason"],
        message: "A rejection reason is required",
      });
    }
  });

export type CreatePrescriptionSubmissionInput = z.infer<
  typeof createPrescriptionSubmissionSchema
>;
export type ReviewPrescriptionSubmissionInput = z.infer<
  typeof reviewPrescriptionSubmissionSchema
>;
