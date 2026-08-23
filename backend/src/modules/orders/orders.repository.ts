import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../shared/db/index";
import {
  businesses,
  orderItems,
  orders,
  products,
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

  async createOrder(userId: string, dto: CreateOrderDTO, pricing: OrderPricing, productRows: Product[]) {
    return db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: createOrderNumber(),
          userId,
          businessId: dto.businessId,
          addressId: dto.addressId,
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
}
