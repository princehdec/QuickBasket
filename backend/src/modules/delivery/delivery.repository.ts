import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../shared/db/index";
import { deliveryJobs, deliveryPartners, orders, type DeliveryJob } from "../../shared/schema/index";

export class DeliveryRepository {
  async findPartnerByUserId(userId: string) {
    const [partner] = await db
      .select()
      .from(deliveryPartners)
      .where(and(eq(deliveryPartners.userId, userId), eq(deliveryPartners.isActive, true)))
      .limit(1);
    return partner;
  }

  async setOnlineStatus(userId: string, isOnline: boolean) {
    const [partner] = await db
      .update(deliveryPartners)
      .set({ isOnline, updatedAt: new Date() })
      .where(eq(deliveryPartners.userId, userId))
      .returning();
    return partner;
  }

  async listJobs(userId: string): Promise<DeliveryJob[]> {
    const partner = await this.findPartnerByUserId(userId);
    if (!partner) return [];
    return db
      .select()
      .from(deliveryJobs)
      .where(inArray(deliveryJobs.partnerId, [partner.id]));
  }

  async updateJob(userId: string, jobId: string, status: DeliveryJob["status"], proofOfDeliveryUrl?: string) {
    const partner = await this.findPartnerByUserId(userId);
    if (!partner) return undefined;

    const [job] = await db
      .select()
      .from(deliveryJobs)
      .where(and(eq(deliveryJobs.id, jobId), eq(deliveryJobs.partnerId, partner.id)))
      .limit(1);
    if (!job) return undefined;

    const now = new Date();
    const update: Partial<typeof deliveryJobs.$inferInsert> = {
      status,
      updatedAt: now,
      ...(status === "accepted" ? { acceptedAt: now } : {}),
      ...(status === "picked_up" ? { pickedUpAt: now } : {}),
      ...(status === "delivered" ? { deliveredAt: now, proofOfDeliveryUrl } : {}),
    };

    const [updated] = await db.update(deliveryJobs).set(update).where(eq(deliveryJobs.id, jobId)).returning();
    if (status === "delivered") {
      await db.update(orders).set({ status: "delivered", deliveredAt: now, updatedAt: now }).where(eq(orders.id, job.orderId));
    }
    return updated;
  }
}
