import { eq, and } from "drizzle-orm";
import { db } from "../../shared/db/index";
import { addresses } from "../../shared/schema/index";
import { ApiError } from "../../shared/utils/apiError";
import { quoteServiceability } from "../serviceability/serviceability.service";
import type { CreateOrderDTO, OrderResponseDTO } from "./orders.dto";
import { OrdersRepository, type OrderPricing } from "./orders.repository";

function toResponse(order: {
  id: string;
  orderNumber: string;
  businessId: string;
  addressId: string;
  prescriptionSubmissionId: string | null;
  prescriptionVerifiedAt: Date | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: string;
  deliveryFee: string;
  platformFee: string;
  taxes: string;
  discount: string;
  grandTotal: string;
  createdAt: Date;
}, items: Array<{
  productId: string | null;
  productName: string;
  productUnit: string | null;
  quantity: number;
  price: string;
}>): OrderResponseDTO {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    businessId: order.businessId,
    addressId: order.addressId,
    prescriptionSubmissionId: order.prescriptionSubmissionId,
    prescriptionVerifiedAt: order.prescriptionVerifiedAt?.toISOString() ?? null,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    platformFee: Number(order.platformFee),
    taxes: Number(order.taxes),
    discount: Number(order.discount),
    grandTotal: Number(order.grandTotal),
    items: items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productUnit: item.productUnit,
      quantity: item.quantity,
      price: Number(item.price),
    })),
    createdAt: order.createdAt.toISOString(),
  };
}

export class OrdersService {
  constructor(private readonly repo = new OrdersRepository()) {}

  async create(userId: string, dto: CreateOrderDTO): Promise<OrderResponseDTO> {
    const uniqueProductIds = [...new Set(dto.items.map((item) => item.productId))];
    if (uniqueProductIds.length !== dto.items.length) {
      throw ApiError.badRequest("Each product may appear only once in an order");
    }

    const address = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, dto.addressId), eq(addresses.userId, userId)))
      .limit(1);
    if (!address[0]) {
      throw ApiError.notFound("Delivery address not found");
    }

    const business = await this.repo.findBusiness(dto.businessId);
    if (!business) {
      throw ApiError.notFound("Business not found or unavailable");
    }

    const productRows = await this.repo.findProductsForBusiness(uniqueProductIds, dto.businessId);
    if (productRows.length !== uniqueProductIds.length) {
      throw ApiError.badRequest("One or more products are unavailable for this business");
    }

    const prescriptionItems = dto.items.filter((item) =>
      productRows.some((product) => product.id === item.productId && product.requiresPrescription),
    );
    const prescriptionSubmissionId = prescriptionItems.length > 0
      ? dto.prescriptionSubmissionId
      : undefined;

    const productById = new Map(productRows.map((product) => [product.id, product]));
    let subtotal = 0;
    for (const item of dto.items) {
      const product = productById.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`${product.name} does not have enough stock`);
      }
      subtotal += Number(product.price) * item.quantity;
    }

    const serviceability = await quoteServiceability(dto.addressId, dto.businessId);
    if (!serviceability.serviceable) {
      throw ApiError.badRequest("This business does not deliver to the selected address");
    }

    const deliveryFee = serviceability.deliveryFee;
    const platformFee = Math.max(5, Number((subtotal * 0.02).toFixed(2)));
    const taxes = Number((subtotal * 0.05).toFixed(2));
    const pricing: OrderPricing = {
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee,
      platformFee,
      taxes,
      discount: 0,
      grandTotal: Number((subtotal + deliveryFee + platformFee + taxes).toFixed(2)),
    };

    const result = await this.repo.createOrder(
      userId,
      dto,
      pricing,
      productRows,
      prescriptionSubmissionId,
      prescriptionItems,
    );
    return toResponse(result.order, result.items);
  }

  async list(userId: string): Promise<OrderResponseDTO[]> {
    const rows = await this.repo.listForUser(userId);
    return rows.map(({ order, items }) => toResponse(order, items));
  }

  async get(userId: string, orderId: string): Promise<OrderResponseDTO> {
    const row = await this.repo.findForUser(orderId, userId);
    if (!row) throw ApiError.notFound("Order not found");
    return toResponse(row.order, row.items);
  }

  async listForVendor(ownerId: string): Promise<OrderResponseDTO[]> {
    const rows = await this.repo.listForBusinessOwner(ownerId);
    return rows.map(({ order, items }) => toResponse(order, items));
  }

  async updateForVendor(ownerId: string, orderId: string, status: "confirmed" | "preparing" | "packed" | "cancelled"): Promise<OrderResponseDTO> {
    const updated = await this.repo.updateStatusForBusinessOwner(orderId, ownerId, status);
    if (!updated) throw ApiError.notFound("Order not found for this vendor");
    return toResponse(updated, []);
  }
}
