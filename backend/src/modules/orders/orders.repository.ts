import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { db } from "../../shared/db/index";
import { ApiError } from "../../shared/utils/apiError";
import {
  businesses,
  orderItems,
  orders,
  products,
  prescriptionSubmissionItems,
  prescriptionSubmissions,
  type Order,
  type OrderItem,
  type Product,
} from "../../shared/schema/index";
import type { CreateOrderDTO } from "./orders.dto";

export type OrderPricing = {
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  grandTotal: number;
};

function createOrderNumber(): string {
  return `QB-${Date.now().toString(36).toUpperCase()}`;
}

export class OrdersRepository {
  async findProductsForBusiness(productIds: string[], businessId: string): Promise<Product[]> {
    if (productIds.length === 0) return [];
    return db
      .select()
      .from(products)
      .where(
        and(
          eq(products.businessId, businessId),
          inArray(products.id, productIds),
          eq(products.isActive, true),
        ),
      );
  }

  async findBusiness(businessId: string) {
    const [business] = await db
      .select()
      .from(businesses)
      .where(and(eq(businesses.id, businessId), eq(businesses.isActive, true)))
      .limit(1);
    return business;
  }

  async createOrder(
    userId: string,
    dto: CreateOrderDTO,
    pricing: OrderPricing,
    productRows: Product[],
    prescriptionSubmissionId?: string,
    prescriptionItems: CreateOrderDTO["items"] = [],
  ) {
    return db.transaction(async (tx) => {
      if (prescriptionItems.length > 0) {
        if (!prescriptionSubmissionId) {
          throw ApiError.badRequest("An approved prescription is required before ordering this product");
        }

        const [submission] = await tx
          .select()
          .from(prescriptionSubmissions)
          .where(
            and(
              eq(prescriptionSubmissions.id, prescriptionSubmissionId),
              eq(prescriptionSubmissions.customerId, userId),
              eq(prescriptionSubmissions.businessId, dto.businessId),
              eq(prescriptionSubmissions.status, "approved"),
              gt(prescriptionSubmissions.expiresAt, new Date()),
            ),
          )
          .limit(1);
        if (!submission) {
          throw ApiError.badRequest("The prescription approval is missing, expired, or not valid for this store");
        }

        const approvedItems = await tx
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
      }

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: createOrderNumber(),
          userId,
          businessId: dto.businessId,
          addressId: dto.addressId,
          prescriptionSubmissionId: prescriptionSubmissionId ?? null,
          prescriptionVerifiedAt: prescriptionSubmissionId && prescriptionItems.length > 0 ? new Date() : null,
          status: "placed",
          paymentMethod: dto.paymentMethod === "net_banking" || dto.paymentMethod === "wallet" ? "upi" : dto.paymentMethod,
          paymentStatus: "pending",
          subtotal: pricing.subtotal.toFixed(2),
          deliveryFee: pricing.deliveryFee.toFixed(2),
          platformFee: pricing.platformFee.toFixed(2),
          taxes: pricing.taxes.toFixed(2),
          discount: pricing.discount.toFixed(2),
          grandTotal: pricing.grandTotal.toFixed(2),
          deliveryNotes: dto.deliveryNotes,
        })
        .returning();

      const productById = new Map(productRows.map((product) => [product.id, product]));
      const itemRows = dto.items.map((item) => {
        const product = productById.get(item.productId)!;
        return {
          orderId: order!.id,
          productId: product.id,
          productName: product.name,
          productUnit: product.unit,
          productImage: product.images?.[0] ?? null,
          isVeg: product.isVeg,
          quantity: item.quantity,
          price: product.price,
          originalPrice: product.originalPrice,
        };
      });

      const items = await tx.insert(orderItems).values(itemRows).returning();
      return { order: order!, items };
    });
  }

  async listForUser(userId: string): Promise<Array<{ order: Order; items: OrderItem[] }>> {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    if (userOrders.length === 0) return [];

    const items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, userOrders.map((order) => order.id)));
    const itemsByOrder = new Map<string, OrderItem[]>();
    for (const item of items) {
      const existing = itemsByOrder.get(item.orderId) ?? [];
      existing.push(item);
      itemsByOrder.set(item.orderId, existing);
    }

    return userOrders.map((order) => ({ order, items: itemsByOrder.get(order.id) ?? [] }));
  }

  async findForUser(orderId: string, userId: string): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
      .limit(1);
    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return { order, items };
  }

  async listForBusinessOwner(ownerId: string): Promise<Array<{ order: Order; items: OrderItem[] }>> {
    const ownerOrders = await db
      .select({ order: orders })
      .from(orders)
      .innerJoin(businesses, eq(orders.businessId, businesses.id))
      .where(eq(businesses.ownerId, ownerId))
      .orderBy(desc(orders.createdAt));

    if (ownerOrders.length === 0) return [];
    const rows = ownerOrders.map((row) => row.order);
    const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, rows.map((order) => order.id)));
    const itemsByOrder = new Map<string, OrderItem[]>();
    for (const item of items) itemsByOrder.set(item.orderId, [...(itemsByOrder.get(item.orderId) ?? []), item]);
    return rows.map((order) => ({ order, items: itemsByOrder.get(order.id) ?? [] }));
  }

  async updateStatusForBusinessOwner(orderId: string, ownerId: string, status: Order["status"]): Promise<Order | undefined> {
    const owned = await db
      .select({ order: orders })
      .from(orders)
      .innerJoin(businesses, eq(orders.businessId, businesses.id))
      .where(and(eq(orders.id, orderId), eq(businesses.ownerId, ownerId)))
      .limit(1);
    if (!owned[0]) return undefined;

    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return updated;
  }
}
