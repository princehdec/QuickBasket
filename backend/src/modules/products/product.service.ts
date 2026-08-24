import { ApiError } from "../../shared/utils/apiError";
import { ProductRepository } from "./product.repository";
import type {
  CreateProductDTO,
  UpdateProductDTO,
  ProductResponseDTO,
} from "./product.dto";

const repo = new ProductRepository();

function toResponseDTO(product: {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  unit: string | null;
  brand: string | null;
  price: string;
  originalPrice: string | null;
  images: string[] | null;
  isVeg: boolean | null;
  isBestseller: boolean;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}): ProductResponseDTO {
  return {
    id: product.id,
    businessId: product.businessId,
    categoryId: product.categoryId,
    name: product.name,
    slug: product.slug,
    description: product.description,
    unit: product.unit,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    images: product.images ?? [],
    isVeg: product.isVeg,
    isBestseller: product.isBestseller,
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export class ProductService {
  async create(
    userId: string,
    dto: CreateProductDTO
  ): Promise<ProductResponseDTO> {
    const ownerId = await repo.findBusinessOwner(dto.businessId);
    if (!ownerId) {
      throw ApiError.notFound("Business not found");
    }
    if (ownerId !== userId) {
      throw ApiError.forbidden("You do not own this business");
    }

    const existing = await repo.findBySlug(dto.businessId, dto.slug);
    if (existing) {
      throw ApiError.conflict(
        "A product with this slug already exists in this business"
      );
    }

    const product = await repo.create({
      businessId: dto.businessId,
      categoryId: dto.categoryId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      unit: dto.unit ?? null,
      brand: dto.brand ?? null,
      price: dto.price,
      originalPrice: dto.originalPrice ?? null,
      images: dto.images ?? [],
      isVeg: dto.isVeg ?? null,
      isBestseller: dto.isBestseller ?? false,
      stock: dto.stock ?? 0,
    });

    return toResponseDTO(product);
  }

  async getAll(filters: {
    businessId?: string;
    categoryId?: string;
    isAvailable?: boolean;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{
    items: ProductResponseDTO[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { items, total } = await repo.findAll(filters);
    return {
      items: items.map(toResponseDTO),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getById(id: string): Promise<ProductResponseDTO> {
    const product = await repo.findById(id);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }
    return toResponseDTO(product);
  }

  async update(
    userId: string,
    productId: string,
    dto: UpdateProductDTO
  ): Promise<ProductResponseDTO> {
    const product = await repo.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    const ownerId = await repo.findBusinessOwner(product.businessId);
    if (ownerId !== userId) {
      throw ApiError.forbidden("You do not own this business");
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await repo.findBySlug(product.businessId, dto.slug);
      if (existing) {
        throw ApiError.conflict(
          "A product with this slug already exists in this business"
        );
      }
    }

    const updated = await repo.update(productId, dto);
    return toResponseDTO(updated!);
  }

  async delete(userId: string, productId: string): Promise<void> {
    const product = await repo.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    const ownerId = await repo.findBusinessOwner(product.businessId);
    if (ownerId !== userId) {
      throw ApiError.forbidden("You do not own this business");
    }

    await repo.softDelete(productId);
  }
}
