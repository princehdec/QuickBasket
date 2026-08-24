import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../shared/db/index";
import { addresses, type Address, type NewAddress } from "../../shared/schema/index";

export class AddressRepository {
  async listForUser(userId: string): Promise<Address[]> {
    return db
      .select()
      .from(addresses)
      .where(and(eq(addresses.userId, userId), isNull(addresses.deletedAt)))
      .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
  }

  async findForUser(id: string, userId: string): Promise<Address | undefined> {
    const result = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId), isNull(addresses.deletedAt)))
      .limit(1);
    return result[0];
  }

  async create(userId: string, data: Omit<NewAddress, "userId">): Promise<Address> {
    return db.transaction(async (tx) => {
      if (data.isDefault) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: sql`now()` })
          .where(and(eq(addresses.userId, userId), isNull(addresses.deletedAt)));
      }

      const result = await tx
        .insert(addresses)
        .values({ ...data, userId })
        .returning();
      return result[0]!;
    });
  }

  async update(id: string, userId: string, data: Partial<NewAddress>): Promise<Address | undefined> {
    return db.transaction(async (tx) => {
      if (data.isDefault) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: sql`now()` })
          .where(and(eq(addresses.userId, userId), isNull(addresses.deletedAt)));
      }

      const result = await tx
        .update(addresses)
        .set({ ...data, updatedAt: sql`now()` })
        .where(and(eq(addresses.id, id), eq(addresses.userId, userId), isNull(addresses.deletedAt)))
        .returning();
      return result[0];
    });
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const result = await db
      .update(addresses)
      .set({ deletedAt: sql`now()`, updatedAt: sql`now()`, isDefault: false })
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId), isNull(addresses.deletedAt)))
      .returning({ id: addresses.id });
    return result.length > 0;
  }
}
