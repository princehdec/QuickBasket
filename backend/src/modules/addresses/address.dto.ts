export type CreateAddressDTO = {
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
  isDefault?: boolean;
};

export type UpdateAddressDTO = Partial<CreateAddressDTO>;

export type AddressResponseDTO = {
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
};
