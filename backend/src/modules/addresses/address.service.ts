import { ApiError } from "../../shared/utils/apiError";
import { AddressRepository } from "./address.repository";
import type { AddressResponseDTO, CreateAddressDTO, UpdateAddressDTO } from "./address.dto";

function toResponse(address: {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  pincode: string | null;
  latitude: string | null;
  longitude: string | null;
  isDefault: boolean;
}): AddressResponseDTO {
  return {
    id: address.id,
    label: address.label,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    latitude: address.latitude,
    longitude: address.longitude,
    isDefault: address.isDefault,
  };
}

export class AddressService {
  constructor(private readonly repo = new AddressRepository()) {}

  async list(userId: string): Promise<AddressResponseDTO[]> {
    const rows = await this.repo.listForUser(userId);
    return rows.map(toResponse);
  }

  async create(userId: string, dto: CreateAddressDTO): Promise<AddressResponseDTO> {
    const current = await this.repo.listForUser(userId);
    const address = await this.repo.create(userId, {
      ...dto,
      label: dto.label ?? "Home",
      addressLine2: dto.addressLine2 ?? null,
      state: dto.state ?? null,
      pincode: dto.pincode ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      isDefault: dto.isDefault ?? current.length === 0,
    });
    return toResponse(address);
  }

  async update(userId: string, id: string, dto: UpdateAddressDTO): Promise<AddressResponseDTO> {
    const address = await this.repo.update(id, userId, {
      ...dto,
      addressLine2: dto.addressLine2 ?? undefined,
      state: dto.state ?? undefined,
      pincode: dto.pincode ?? undefined,
      latitude: dto.latitude ?? undefined,
      longitude: dto.longitude ?? undefined,
    });
    if (!address) throw ApiError.notFound("Delivery address not found");
    return toResponse(address);
  }

  async remove(userId: string, id: string): Promise<void> {
    const removed = await this.repo.softDelete(id, userId);
    if (!removed) throw ApiError.notFound("Delivery address not found");
  }
}
