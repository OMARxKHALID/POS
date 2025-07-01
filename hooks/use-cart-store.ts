"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, MenuItem } from "@/types/pos";

// Helper function for discount validation
const clampDiscount = (discount: number) =>
  Math.max(0, Math.min(100, discount));

interface CartStore {
  orderItems: CartItem[];
  cartDiscount: number;
  addToCart: (item: MenuItem, quantity: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyItemDiscount: (id: string, discount: number) => void;
  applyCartDiscount: (discount: number) => void;
  removeItemDiscount: (id: string) => void;
  removeCartDiscount: () => void;
  getTotalItems: () => number;
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      orderItems: [],
      cartDiscount: 0,

      addToCart: (item, quantity) =>
        set(({ orderItems }) => {
          const existingIndex = orderItems.findIndex((i) => i.id === item.id);

          if (existingIndex >= 0) {
            const updatedItems = [...orderItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { orderItems: updatedItems };
          }

          return {
            orderItems: [
              ...orderItems,
              {
                ...item,
                quantity,
                discount: 0,
              } as CartItem,
            ],
          };
        }),

      updateQuantity: (id, quantity) =>
        set(({ orderItems }) => ({
          orderItems:
            quantity <= 0
              ? orderItems.filter((item) => item.id !== id)
              : orderItems.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                ),
        })),

      removeFromCart: (id) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ orderItems: [], cartDiscount: 0 }),

      applyItemDiscount: (id, discount) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.map((item) =>
            item.id === id
              ? { ...item, discount: clampDiscount(discount) }
              : item
          ),
        })),

      applyCartDiscount: (discount) =>
        set({
          cartDiscount: clampDiscount(discount),
        }),

      removeItemDiscount: (id) =>
        set(({ orderItems }) => ({
          orderItems: orderItems.map((item) =>
            item.id === id ? { ...item, discount: 0 } : item
          ),
        })),

      removeCartDiscount: () => set({ cartDiscount: 0 }),

      getTotalItems: () => get().orderItems.length,

      getTotalQuantity: () =>
        get().orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
