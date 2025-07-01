"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CartItem, MenuItem } from "@/types/pos"

interface CartStore {
  orderItems: CartItem[]
  cartDiscount: number
  addToCart: (item: MenuItem, quantity: number, notes?: string) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  applyItemDiscount: (id: string, discount: number) => void
  applyCartDiscount: (discount: number) => void
  removeItemDiscount: (id: string) => void
  removeCartDiscount: () => void
  getTotalItems: () => number
  getTotalQuantity: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      orderItems: [],
      cartDiscount: 0,

      addToCart: (item, quantity, notes) =>
        set((state) => {
          const existingItem = state.orderItems.find((i) => i.id === item.id && i.notes === notes)
          if (existingItem) {
            return {
              orderItems: state.orderItems.map((i) =>
                i.id === item.id && i.notes === notes ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            }
          }
          return {
            orderItems: [
              ...state.orderItems,
              {
                id: item.id + (notes ? `-${Date.now()}` : ""),
                name: item.name,
                price: item.price,
                quantity,
                icon: item.icon,
                category: item.category,
                notes,
                discount: 0,
              },
            ],
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          orderItems:
            quantity <= 0
              ? state.orderItems.filter((item) => item.id !== id)
              : state.orderItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          orderItems: state.orderItems.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ orderItems: [], cartDiscount: 0 }),

      applyItemDiscount: (id, discount) =>
        set((state) => ({
          orderItems: state.orderItems.map((item) =>
            item.id === id ? { ...item, discount: Math.max(0, Math.min(100, discount)) } : item,
          ),
        })),

      applyCartDiscount: (discount) => set({ cartDiscount: Math.max(0, Math.min(100, discount)) }),

      removeItemDiscount: (id) =>
        set((state) => ({
          orderItems: state.orderItems.map((item) => (item.id === id ? { ...item, discount: 0 } : item)),
        })),

      removeCartDiscount: () => set({ cartDiscount: 0 }),

      getTotalItems: () => get().orderItems.length,

      getTotalQuantity: () => get().orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
