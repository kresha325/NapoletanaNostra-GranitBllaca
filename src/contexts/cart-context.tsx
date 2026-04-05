import React, { createContext, useContext } from "react";
import { useCart as useCartHook, CartItem } from "@/hooks/use-cart";

interface CartContextType {
  cart: CartItem[];
  note: string;
  setNote: (note: string) => void;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartApi = useCartHook();
  return <CartContext.Provider value={cartApi}>{children}</CartContext.Provider>;
};

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within a CartProvider");
  return ctx;
}
