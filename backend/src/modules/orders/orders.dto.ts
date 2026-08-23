export type CreateOrderItemDTO = {
  productId: string;
  quantity: number;
};

export type CreateOrderDTO = {
  businessId: string;
  addressId: string;
  paymentMethod: "upi" | "credit_card" | "debit_card" | "net_banking" | "wallet";
  items: CreateOrderItemDTO[];
  deliveryNotes?: string;
};

export type OrderResponseDTO = {
  id: string;
  orderNumber: string;
  businessId: string;
  addressId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  items: Array<{
    productId: string | null;
    productName: string;
    productUnit: string | null;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
};
