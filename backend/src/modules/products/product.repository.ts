import { db } from "../../shared/db/index";
import {
  products,
  type Product,
  type NewProduct,
  businesses,
  categories,
} from "../../shared/schema/index";
import {
  eq,
  and,
  isNull,
  or,
  ilike,
  desc,
  count,
  sql,
  type SQL,
  getTableColumns,
} from "drizzle-orm";

export class ProductRepository {
  async findById(id: string): Promise<(Product & { categoryName: string | null; categorySlug: string | null }) | undefined> {
    const result = await db
      .select({
        ...getTableColumns(products),
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1);
    return result[0];
  }

  async findBySlug(
    businessId: string,
    slug: string
  ): Promise<Product | undefined> {
    const result = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.businessId, businessId),
          eq(products.slug, slug),
          isNull(products.deletedAt)
        )
      )
      .limit(1);
    return result[0];
  }

  async findBusinessOwner(
    businessId: string
  ): Promise<string | null> {
    const result = await db
      .select({ ownerId: businesses.ownerId })
      .from(businesses)
      .where(and(eq(businesses.id, businessId), isNull(businesses.deletedAt)))
      .limit(1);
    return result[0]?.ownerId ?? null;
  }

  async findAll(filters: {
    businessId?: string;
    categoryId?: string;
    isAvailable?: boolean;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: Array<Product & { categoryName: string | null; categorySlug: string | null }>; total: number }> {
    const conditions: SQL[] = [isNull(products.deletedAt)];

    if (filters.businessId) {
      conditions.push(eq(products.businessId, filters.businessId));
    }

    if (filters.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters.isAvailable !== undefined) {
      conditions.push(eq(products.isActive, filters.isAvailable));
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )!
      );
    }

    const where = and(...conditions);

    const items = await db
      .select({
        ...getTableColumns(products),
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit);

    const totalResult = await db
      .select({ value: count() })
      .from(products)
      .where(where);

    return { items, total: Number(totalResult[0]!.value) };
  }

  async create(data: NewProduct): Promise<Product> {
    const result = await db.insert(products).values(data).returning();
    return result[0]!;
  }

  async update(
    id: string,
    data: Partial<NewProduct>
  ): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set({ ...data, updatedAt: sql`now()` })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning();
    return result[0];
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(products)
      .set({ deletedAt: sql`now()` })
      .where(eq(products.id, id));
  }
}
