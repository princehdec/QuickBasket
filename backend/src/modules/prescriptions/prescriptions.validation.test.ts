import assert from "node:assert/strict";
import test from "node:test";
import {
  createPrescriptionSubmissionSchema,
  reviewPrescriptionSubmissionSchema,
} from "./prescriptions.validation";

const businessId = "11111111-1111-4111-8111-111111111111";
const productId = "22222222-2222-4222-8222-222222222222";

const validSubmission = {
  businessId,
  items: [{ productId, quantity: 1 }],
  documentKey: "prescriptions/customer-123/scan.pdf",
  documentFileName: "scan.pdf",
  documentMimeType: "application/pdf" as const,
  documentSizeBytes: 1024,
};

test("accepts a bounded prescription submission contract", () => {
  const result = createPrescriptionSubmissionSchema.safeParse(validSubmission);
  assert.equal(result.success, true);
});

test("rejects unsupported document types and oversized files", () => {
  const result = createPrescriptionSubmissionSchema.safeParse({
    ...validSubmission,
    documentMimeType: "text/plain",
    documentSizeBytes: 10_000_001,
  });
  assert.equal(result.success, false);
});

test("requires a reason when a reviewer rejects a submission", () => {
  const result = reviewPrescriptionSubmissionSchema.safeParse({ status: "rejected" });
  assert.equal(result.success, false);
});

test("allows approval without a rejection reason", () => {
  const result = reviewPrescriptionSubmissionSchema.safeParse({ status: "approved" });
  assert.equal(result.success, true);
});
