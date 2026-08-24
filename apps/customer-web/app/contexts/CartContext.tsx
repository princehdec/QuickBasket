"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  normalizeCustomerProduct,
  type CustomerProduct,
  type LegacyCustomerProduct,
} from "../../lib/api";

export type CartItem = {
  product: CustomerProduct;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: CustomerProduct | LegacyCustomerProduct) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: CustomerProduct | LegacyCustomerProduct) => {
    const normalizedProduct = normalizeCustomerProduct(product);
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === normalizedProduct.id);
      if (existing) {
        return prev.map((i) =>
            i.product.id === normalizedProduct.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product: normalizedProduct, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const increaseQuantity = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  }, []);

  const decreaseQuantity = useCallback((productId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const getSubtotal = useCallback(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      getTotalItems,
      getSubtotal,
    }),
    [items, addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, getTotalItems, getSubtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
