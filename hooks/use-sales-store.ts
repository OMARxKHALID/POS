"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { SalesOrder } from "@/types/pos"

interface SalesAnalytics {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topProducts: Array<{ name: string; quantity: number; revenue: number }>
  topCustomers: Array<{ name: string; orders: number; total: number }>
  salesByDay: Array<{ date: string; sales: number; orders: number }>
  salesByPaymentMethod: Array<{ method: string; amount: number; count: number }>
}

interface SalesStore {
  orders: SalesOrder[]
  addOrder: (order: SalesOrder) => void
  updateOrderStatus: (id: string, status: SalesOrder["status"]) => void
  getOrderById: (id: string) => SalesOrder | undefined
  getOrdersByDateRange: (startDate: Date, endDate: Date) => SalesOrder[]
  getAnalytics: () => SalesAnalytics
}

export const useSalesStore = create<SalesStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        })),

      getOrderById: (id) => get().orders.find((order) => order.id === id),

      getOrdersByDateRange: (startDate, endDate) =>
        get().orders.filter((order) => {
          const orderDate = new Date(order.timestamp)
          return orderDate >= startDate && orderDate <= endDate
        }),

      getAnalytics: () => {
        const orders = get().orders.filter((order) => order.status === "completed")

        const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
        const totalOrders = orders.length
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

        // Top products
        const productMap = new Map()
        orders.forEach((order) => {
          order.items.forEach((item) => {
            const key = item.name
            if (productMap.has(key)) {
              const existing = productMap.get(key)
              productMap.set(key, {
                name: item.name,
                quantity: existing.quantity + item.quantity,
                revenue: existing.revenue + item.price * item.quantity,
              })
            } else {
              productMap.set(key, {
                name: item.name,
                quantity: item.quantity,
                revenue: item.price * item.quantity,
              })
            }
          })
        })
        const topProducts = Array.from(productMap.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 10)

        // Top customers
        const customerMap = new Map()
        orders.forEach((order) => {
          const key = order.customerName
          if (customerMap.has(key)) {
            const existing = customerMap.get(key)
            customerMap.set(key, {
              name: order.customerName,
              orders: existing.orders + 1,
              total: existing.total + order.total,
            })
          } else {
            customerMap.set(key, {
              name: order.customerName,
              orders: 1,
              total: order.total,
            })
          }
        })
        const topCustomers = Array.from(customerMap.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 10)

        // Sales by day (last 7 days)
        const salesByDay = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split("T")[0]

          const dayOrders = orders.filter((order) => order.date === date.toLocaleDateString())
          salesByDay.push({
            date: dateStr,
            sales: dayOrders.reduce((sum, order) => sum + order.total, 0),
            orders: dayOrders.length,
          })
        }

        // Sales by payment method
        const paymentMap = new Map()
        orders.forEach((order) => {
          const method = order.paymentMethod
          if (paymentMap.has(method)) {
            const existing = paymentMap.get(method)
            paymentMap.set(method, {
              method,
              amount: existing.amount + order.total,
              count: existing.count + 1,
            })
          } else {
            paymentMap.set(method, {
              method,
              amount: order.total,
              count: 1,
            })
          }
        })
        const salesByPaymentMethod = Array.from(paymentMap.values())

        return {
          totalSales,
          totalOrders,
          averageOrderValue,
          topProducts,
          topCustomers,
          salesByDay,
          salesByPaymentMethod,
        }
      },
    }),
    {
      name: "sales-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
