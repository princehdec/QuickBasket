import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { db } from "../../shared/db/index";
import {
  prescriptionReviewEvents,
  prescriptionSubmissionItems,
  prescriptionSubmissions,
  products,
} from "../../shared/schema/index";
import { ApiError } from "../../shared/utils/apiError";
import type {
  CreatePrescriptionSubmissionInput,
  ReviewPrescriptionSubmissionInput,
} from "./prescriptions.validation";

const DOCUMENT_KEY_PREFIX = "prescriptions/";
const REVIEW_VALIDITY_DAYS = 30;

function expiryDate(): Date {
  const expiresAt = new Date();
  expiresAt.setUTCDate(expiresAt.getUTCDate() + REVIEW_VALIDITY_DAYS);
  return expiresAt;
}

function assertUniqueItems(items: CreatePrescriptionSubmissionInput["items"]): void {
  const ids = new Set(items.map((item) => item.productId));
  if (ids.size !== items.length) {
    throw ApiError.badRequest("Each prescription product may appear only once");
  }
}

function assertOwnedDocumentKey(customerId: string, documentKey: string): void {
  const expectedPrefix = `${DOCUMENT_KEY_PREFIX}${customerId}/`;
  if (!documentKey.startsWith(expectedPrefix)) {
    throw ApiError.badRequest("Prescription document key is not owned by this customer");
  }
}

export class PrescriptionsService {
  async submit(customerId: string, input: CreatePrescriptionSubmissionInput) {
    assertUniqueItems(input.items);
    assertOwnedDocumentKey(customerId, input.documentKey);

    const productIds = input.items.map((item) => item.productId);
    const productRows = await db
      .select({
        id: products.id,
        businessId: products.businessId,
        requiresPrescription: products.requiresPrescription,
      })
      .from(products)
      .where(
        and(
          eq(products.businessId, input.businessId),
          inArray(products.id, productIds),
          eq(products.isActive, true),
        ),
      );

    if (productRows.length !== productIds.length) {
      throw ApiError.badRequest("One or more prescription products are unavailable");
    }
    if (productRows.some((product) => !product.requiresPrescription)) {
      throw ApiError.badRequest("Every submitted product must require a prescription");
    }

    const expiresAt = expiryDate();
    return db.transaction(async (tx) => {
      const [submission] = await tx
        .insert(prescriptionSubmissions)
        .values({
          customerId,
          businessId: input.businessId,
          documentKey: input.documentKey,
          documentFileName: input.documentFileName,
          documentMimeType: input.documentMimeType,
          documentSizeBytes: input.documentSizeBytes,
          expiresAt,
        })
        .returning();

      if (!submission) {
        throw ApiError.internal("Prescription submission could not be created");
      }

      await tx.insert(prescriptionSubmissionItems).values(
        input.items.map((item) => ({
          submissionId: submission.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      );

      await tx.insert(prescriptionReviewEvents).values({
        submissionId: submission.id,
        eventType: "submitted",
        actorId: customerId,
      });

      return submission;
    });
  }

  async listForCustomer(customerId: string) {
    return db
      .select()
      .from(prescriptionSubmissions)
      .where(eq(prescriptionSubmissions.customerId, customerId))
      .orderBy(desc(prescriptionSubmissions.createdAt));
  }

  async getForCustomer(customerId: string, submissionId: string) {
    const [submission] = await db
      .select()
      .from(prescriptionSubmissions)
      .where(
        and(
          eq(prescriptionSubmissions.id, submissionId),
          eq(prescriptionSubmissions.customerId, customerId),
        ),
      )
      .limit(1);
    if (!submission) return undefined;

    const items = await db
      .select()
      .from(prescriptionSubmissionItems)
      .where(eq(prescriptionSubmissionItems.submissionId, submission.id));
    const events = await db
      .select()
      .from(prescriptionReviewEvents)
      .where(eq(prescriptionReviewEvents.submissionId, submission.id))
      .orderBy(desc(prescriptionReviewEvents.createdAt));

    return { submission, items, events };
  }

  async listReviewQueue() {
    return db
      .select()
      .from(prescriptionSubmissions)
      .where(eq(prescriptionSubmissions.status, "pending"))
      .orderBy(prescriptionSubmissions.createdAt);
  }

  async review(
    reviewerId: string,
    submissionId: string,
    input: ReviewPrescriptionSubmissionInput,
  ) {
    return db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(prescriptionSubmissions)
        .where(eq(prescriptionSubmissions.id, submissionId))
        .limit(1);

      if (!existing) return undefined;
      if (existing.status !== "pending") {
        throw ApiError.conflict("This prescription submission has already been reviewed");
      }

      const [updated] = await tx
        .update(prescriptionSubmissions)
        .set({
          status: input.status,
          reviewerId,
          rejectionReason: input.status === "rejected" ? input.rejectionReason : null,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(prescriptionSubmissions.id, submissionId), eq(prescriptionSubmissions.status, "pending")))
        .returning();

      if (!updated) {
        throw ApiError.conflict("This prescription submission has already been reviewed");
      }

      await tx.insert(prescriptionReviewEvents).values({
        submissionId,
        eventType: input.status,
        actorId: reviewerId,
        note: input.rejectionReason,
      });

      return updated;
    });
  }

  async validateForOrder(
    customerId: string,
    businessId: string,
    submissionId: string | undefined,
    prescriptionItems: Array<{ productId: string; quantity: number }>,
  ): Promise<string | undefined> {
    if (prescriptionItems.length === 0) return undefined;
    if (!submissionId) {
      throw ApiError.badRequest("An approved prescription is required before ordering this product");
    }

    const now = new Date();
    const [submission] = await db
      .select()
      .from(prescriptionSubmissions)
      .where(
        and(
          eq(prescriptionSubmissions.id, submissionId),
          eq(prescriptionSubmissions.customerId, customerId),
          eq(prescriptionSubmissions.businessId, businessId),
          eq(prescriptionSubmissions.status, "approved"),
          gt(prescriptionSubmissions.expiresAt, now),
        ),
      )
      .limit(1);

    if (!submission) {
      throw ApiError.badRequest("The prescription approval is missing, expired, or not valid for this store");
    }

    const approvedItems = await db
      .select()
      .from(prescriptionSubmissionItems)
      .where(
        and(
          eq(prescriptionSubmissionItems.submissionId, submission.id),
          inArray(
            prescriptionSubmissionItems.productId,
            prescriptionItems.map((item) => item.productId),
          ),
        ),
      );
    const approvedQuantityByProduct = new Map(
      approvedItems.map((item) => [item.productId, item.quantity]),
    );

    for (const item of prescriptionItems) {
      const approvedQuantity = approvedQuantityByProduct.get(item.productId);
      if (!approvedQuantity || item.quantity > approvedQuantity) {
        throw ApiError.badRequest("The approved prescription does not cover the requested quantity");
      }
    }

    return submission.id;
  }
}
