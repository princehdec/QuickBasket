import { ApiError } from "../../shared/utils/apiError";
import { BusinessRepository } from "./business.repository";
import type {
  CreateBusinessDTO,
  UpdateBusinessDTO,
  BusinessResponseDTO,
} from "./business.dto";

const repo = new BusinessRepository();

function toResponseDTO(business: {
  id: string;
  ownerId: string | null;
  name: string;
  slug: string;
  description: string | null;
  businessType: string;
  phone: string | null;
  email: string | null;
  logo: string | null;
  banner: string | null;
  address: string | null;
  city: string;
  latitude: string | null;
  longitude: string | null;
  rating: string | null;
  totalRatings: string | null;
  deliveryFee: string | null;
  minOrder: string | null;
  tags: string[] | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}): BusinessResponseDTO {
  return {
    id: business.id,
    ownerId: business.ownerId,
    name: business.name,
    slug: business.slug,
    description: business.description,
    businessType: business.businessType,
    phone: business.phone,
    email: business.email,
    logo: business.logo,
    banner: business.banner,
    address: business.address,
    city: business.city,
    latitude: business.latitude,
    longitude: business.longitude,
    rating: business.rating,
    totalRatings: business.totalRatings,
    deliveryFee: business.deliveryFee,
    minOrder: business.minOrder,
    tags: business.tags ?? [],
    isActive: business.isActive,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt,
  };
}

export class BusinessService {
  async create(
    ownerId: string,
    dto: CreateBusinessDTO
  ): Promise<BusinessResponseDTO> {
    const existing = await repo.findBySlug(dto.slug);
    if (existing) {
      throw ApiError.conflict("A business with this slug already exists");
    }

    const business = await repo.create({
      ownerId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      businessType: dto.businessType,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      logo: dto.logo ?? null,
      banner: dto.banner ?? null,
      address: dto.address ?? null,
      city: dto.city,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      deliveryFee: dto.deliveryFee ?? null,
      minOrder: dto.minOrder ?? null,
      tags: dto.tags ?? [],
    });

    return toResponseDTO(business);
  }

  async getMyBusinesses(ownerId: string): Promise<BusinessResponseDTO[]> {
    const results = await repo.findByOwnerId(ownerId);
    return results.map(toResponseDTO);
  }

  async getAll(
    filters: {
      city?: string;
      businessType?: string;
      search?: string;
      page: number;
      limit: number;
    }
  ): Promise<{
    items: BusinessResponseDTO[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
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

  async getById(id: string): Promise<BusinessResponseDTO> {
    const business = await repo.findById(id);
    if (!business) {
      throw ApiError.notFound("Business not found");
    }
    return toResponseDTO(business);
  }

  async update(
    userId: string,
    businessId: string,
    dto: UpdateBusinessDTO
  ): Promise<BusinessResponseDTO> {
    const business = await repo.findById(businessId);
    if (!business) {
      throw ApiError.notFound("Business not found");
    }

    if (business.ownerId !== userId) {
      throw ApiError.forbidden("You do not own this business");
    }

    if (dto.slug && dto.slug !== business.slug) {
      const existing = await repo.findBySlug(dto.slug);
      if (existing) {
        throw ApiError.conflict("A business with this slug already exists");
      }
    }

    const updated = await repo.update(businessId, dto);
    return toResponseDTO(updated!);
  }

  async delete(userId: string, businessId: string): Promise<void> {
    const business = await repo.findById(businessId);
    if (!business) {
      throw ApiError.notFound("Business not found");
    }

    if (business.ownerId !== userId) {
      throw ApiError.forbidden("You do not own this business");
    }

    await repo.softDelete(businessId);
  }
}
