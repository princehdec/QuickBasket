export type CreateProductDTO = {
  businessId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  unit?: string;
  brand?: string;
  price: string;
  originalPrice?: string;
  images?: string[];
  isVeg?: boolean;
  isBestseller?: boolean;
  stock?: number;
};

export type UpdateProductDTO = {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  unit?: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  images?: string[];
  isVeg?: boolean;
  isBestseller?: boolean;
  stock?: number;
  isActive?: boolean;
};

export type ProductResponseDTO = {
  id: string;
  businessId: string;
  categoryId: string;
  categoryName: string | null;
  categorySlug: string | null;
  name: string;
  slug: string;
  description: string | null;
  unit: string | null;
  brand: string | null;
  price: string;
  originalPrice: string | null;
  images: string[];
  isVeg: boolean | null;
  isBestseller: boolean;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
