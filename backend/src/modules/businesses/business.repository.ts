import { db } from "../../shared/db/index";
import {
  businesses,
  type Business,
  type NewBusiness,
} from "../../shared/schema/index";
import { eq, and, isNull, or, ilike, desc, count, sql, type SQL } from "drizzle-orm";

export class BusinessRepository {
  async findById(id: string): Promise<Business | undefined> {
    const result = await db
      .select()
      .from(businesses)
      .where(and(eq(businesses.id, id), isNull(businesses.deletedAt)))
      .limit(1);
    return result[0];
  }

  async findBySlug(slug: string): Promise<Business | undefined> {
    const result = await db
      .select()
      .from(businesses)
      .where(
        and(eq(businesses.slug, slug), isNull(businesses.deletedAt))
      )
      .limit(1);
    return result[0];
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    return db
      .select()
      .from(businesses)
      .where(
        and(eq(businesses.ownerId, ownerId), isNull(businesses.deletedAt))
      );
  }

  async findAll(filters: {
    city?: string;
    businessType?: string;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: Business[]; total: number }> {
    const conditions: SQL[] = [isNull(businesses.deletedAt)];

    if (filters.city) {
      conditions.push(eq(businesses.city, filters.city));
    }

    if (filters.businessType) {
      conditions.push(sql`${businesses.businessType} = ${filters.businessType}`);
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(businesses.name, `%${filters.search}%`),
          ilike(businesses.description, `%${filters.search}%`)
        )!
      );
    }

    const where = and(...conditions);

    const items = await db
      .select()
      .from(businesses)
      .where(where)
      .orderBy(desc(businesses.createdAt))
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit);

    const totalResult = await db
      .select({ value: count() })
      .from(businesses)
      .where(where);

    return { items, total: Number(totalResult[0]!.value) };
  }

  async create(data: NewBusiness): Promise<Business> {
    const result = await db
      .insert(businesses)
      .values(data)
      .returning();
    return result[0]!;
  }

  async update(
    id: string,
    data: Partial<NewBusiness>
  ): Promise<Business | undefined> {
    const result = await db
      .update(businesses)
      .set({ ...data, updatedAt: sql`now()` })
      .where(and(eq(businesses.id, id), isNull(businesses.deletedAt)))
      .returning();
    return result[0];
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(businesses)
      .set({ deletedAt: sql`now()` })
      .where(eq(businesses.id, id));
  }
}
