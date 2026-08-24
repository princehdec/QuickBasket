const DEFAULT_API_BASE_URL = "http://localhost:4000";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type CustomerBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  businessType: string;
  city: string;
  rating: number | string | null;
  deliveryFee: string | null;
  minOrder: string | null;
  tags: string[] | null;
  address: string | null;
  isActive: boolean;
};

export type LegacyCustomerProduct = {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  unit: string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
};

export type CustomerProduct = {
  id: string;
  storeId: string;
  businessId: string;
  categoryId: string;
  categoryName: string | null;
  name: string;
  unit: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string | null;
  brand: string | null;
  isVeg: boolean;
  isBestseller: boolean;
  stock: number;
};

export function normalizeCustomerProduct(
  product: CustomerProduct | LegacyCustomerProduct
): CustomerProduct {
  if ("businessId" in product) return product;
  return {
    ...product,
    businessId: product.storeId,
    categoryName: null,
    images: [],
    description: null,
    brand: null,
    isBestseller: product.isBestseller ?? false,
    stock: 999,
  };
}

export type CustomerStore = {
  id: string;
  name: string;
  logoGradient: string;
  bannerGradient: string;
  rating: number;
  distance: string;
  deliveryTime: string;
  isOpen: boolean;
  minOrder: string;
  deliveryFee: string;
  description: string;
  tags: string[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(body && "message" in body ? body.message : "Request failed");
  }

  if (!body || !("data" in body)) {
    throw new Error("The API returned an invalid response");
  }

  return body.data;
}

function queryString(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
}

export function toCustomerStore(business: CustomerBusiness): CustomerStore {
  const palette: Record<string, { logo: string; banner: string }> = {
    GROCERY: { logo: "from-emerald-500 to-green-600", banner: "from-green-100 via-green-200 to-emerald-100" },
    PHARMACY: { logo: "from-blue-500 to-blue-600", banner: "from-blue-100 via-blue-200 to-sky-100" },
    ELECTRONICS: { logo: "from-violet-500 to-purple-600", banner: "from-violet-100 via-purple-100 to-fuchsia-100" },
    FOOD: { logo: "from-orange-500 to-red-500", banner: "from-orange-100 via-amber-100 to-red-100" },
    FASHION: { logo: "from-pink-500 to-rose-600", banner: "from-pink-100 via-rose-100 to-orange-100" },
    LAUNDRY: { logo: "from-cyan-500 to-sky-600", banner: "from-cyan-100 via-sky-100 to-blue-100" },
    STATIONERY: { logo: "from-amber-500 to-yellow-600", banner: "from-amber-100 via-yellow-100 to-orange-100" },
  };
  const colors = palette[business.businessType] ?? {
    logo: "from-slate-500 to-slate-700",
    banner: "from-slate-100 via-gray-100 to-stone-100",
  };
  const rating = Number(business.rating ?? 0);
  const deliveryFee = business.deliveryFee ? `₹${business.deliveryFee}` : "Free";

  return {
    id: business.id,
    name: business.name,
    logoGradient: colors.logo,
    bannerGradient: colors.banner,
    rating: Number.isFinite(rating) ? rating : 0,
    distance: "Nearby",
    deliveryTime: "25–40 min",
    isOpen: business.isActive,
    minOrder: business.minOrder ? `₹${business.minOrder}` : "₹0",
    deliveryFee,
    description: business.description ?? `${business.businessType} store in ${business.city}`,
    tags: business.tags ?? [business.businessType],
  };
}

export function toCustomerProduct(product: Omit<CustomerProduct, "storeId" | "price" | "originalPrice" | "image" | "unit" | "isVeg" | "categoryName"> & {
  businessId: string;
  price: string | number;
  originalPrice?: string | number | null;
  images?: string[];
  unit?: string | null;
  isVeg?: boolean | null;
  categoryName?: string | null;
}): CustomerProduct {
  const images = product.images ?? [];
  const price = Number(product.price);
  const originalPrice = product.originalPrice == null ? undefined : Number(product.originalPrice);

  return {
    ...product,
    storeId: product.businessId,
    categoryName: product.categoryName ?? null,
    unit: product.unit ?? "1 unit",
    price: Number.isFinite(price) ? price : 0,
    originalPrice: originalPrice !== undefined && Number.isFinite(originalPrice) ? originalPrice : undefined,
    images,
    image: "from-green-50 via-emerald-50 to-lime-50",
    isVeg: product.isVeg ?? false,
    isBestseller: product.isBestseller ?? false,
    stock: product.stock ?? 0,
  };
}

export async function listBusinesses(params: {
  city?: string;
  businessType?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ items: CustomerBusiness[]; pagination: { total: number } }> {
  return request(`/api/v1/businesses${queryString({ ...params, page: params.page ?? 1, limit: params.limit ?? 50 })}`);
}

export async function getBusiness(id: string): Promise<CustomerBusiness> {
  return request(`/api/v1/businesses/${encodeURIComponent(id)}`);
}

export async function listProducts(params: {
  businessId?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  isAvailable?: boolean;
} = {}): Promise<{ items: CustomerProduct[]; pagination: { total: number } }> {
  const result = await request<{
    items: Array<Parameters<typeof toCustomerProduct>[0]>;
    pagination: { total: number };
  }>(`/api/v1/products${queryString({ ...params, page: params.page ?? 1, limit: params.limit ?? 50 })}`);

  return {
    ...result,
    items: result.items.map(toCustomerProduct),
  };
}

export type CustomerAddress = {
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

export type CreateCustomerAddressInput = {
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
};

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("qb_access_token");
}

async function authenticatedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Please sign in to manage delivery addresses");

  return request<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
}

export function listAddresses(): Promise<CustomerAddress[]> {
  return authenticatedRequest<CustomerAddress[]>("/api/v1/addresses");
}

export function createAddress(input: CreateCustomerAddressInput): Promise<CustomerAddress> {
  return authenticatedRequest<CustomerAddress>("/api/v1/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateAddress(
  id: string,
  input: Partial<CreateCustomerAddressInput>
): Promise<CustomerAddress> {
  return authenticatedRequest<CustomerAddress>(`/api/v1/addresses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteAddress(id: string): Promise<void> {
  await authenticatedRequest<null>(`/api/v1/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
