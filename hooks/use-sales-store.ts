"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SalesOrder } from "@/types/pos";

// Helper types for analytics
type ProductStats = { name: string; quantity: number; revenue: number };
type CustomerStats = { name: string; orders: number; total: number };
type DailySales = { date: string; sales: number; orders: number };
type PaymentStats = { method: string; amount: number; count: number };

interface SalesAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: ProductStats[];
  topCustomers: CustomerStats[];
  salesByDay: DailySales[];
  salesByPaymentMethod: PaymentStats[];
}

interface SalesStore {
  orders: SalesOrder[];
  addOrder: (order: SalesOrder) => void;
  updateOrderStatus: (id: string, status: SalesOrder["status"]) => void;
  getOrderById: (id: string) => SalesOrder | undefined;
  getOrdersByDateRange: (startDate: Date, endDate: Date) => SalesOrder[];
  getAnalytics: () => SalesAnalytics;
}

// Helper functions for analytics
const aggregateProducts = (orders: SalesOrder[]): ProductStats[] => {
  const productMap = new Map<string, ProductStats>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = productMap.get(item.name) || {
        name: item.name,
        quantity: 0,
        revenue: 0,
      };

      productMap.set(item.name, {
        ...current,
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + item.price * item.quantity,
      });
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
};

const aggregateCustomers = (orders: SalesOrder[]): CustomerStats[] => {
  const customerMap = new Map<string, CustomerStats>();

  orders.forEach((order) => {
    const current = customerMap.get(order.customerName) || {
      name: order.customerName,
      orders: 0,
      total: 0,
    };

    customerMap.set(order.customerName, {
      ...current,
      orders: current.orders + 1,
      total: current.total + order.total,
    });
  });

  return Array.from(customerMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
};

const getDailySales = (orders: SalesOrder[]): DailySales[] => {
  const dailyMap = new Map<string, DailySales>();
  const today = new Date();

  // Initialize last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    dailyMap.set(dateStr, {
      date: dateStr,
      sales: 0,
      orders: 0,
    });
  }

  // Aggregate order data
  orders.forEach((order) => {
    const orderDate = new Date(order.timestamp);
    const dateKey = orderDate.toISOString().split("T")[0];

    if (dailyMap.has(dateKey)) {
      const day = dailyMap.get(dateKey)!;
      dailyMap.set(dateKey, {
        ...day,
        sales: day.sales + order.total,
        orders: day.orders + 1,
      });
    }
  });

  return Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

const aggregatePayments = (orders: SalesOrder[]): PaymentStats[] => {
  const paymentMap = new Map<string, PaymentStats>();

  orders.forEach((order) => {
    const current = paymentMap.get(order.paymentMethod) || {
      method: order.paymentMethod,
      amount: 0,
      count: 0,
    };

    paymentMap.set(order.paymentMethod, {
      ...current,
      amount: current.amount + order.total,
      count: current.count + 1,
    });
  });

  return Array.from(paymentMap.values());
};

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
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),

      getOrderById: (id) => get().orders.find((order) => order.id === id),

      getOrdersByDateRange: (startDate, endDate) =>
        get().orders.filter((order) => {
          const orderDate = new Date(order.timestamp);
          return orderDate >= startDate && orderDate <= endDate;
        }),

      getAnalytics: () => {
        const completedOrders = get().orders.filter(
          (order) => order.status === "completed"
        );

        const totalSales = completedOrders.reduce(
          (sum, order) => sum + order.total,
          0
        );
        const totalOrders = completedOrders.length;
        const averageOrderValue =
          totalOrders > 0 ? totalSales / totalOrders : 0;

        return {
          totalSales,
          totalOrders,
          averageOrderValue,
          topProducts: aggregateProducts(completedOrders),
          topCustomers: aggregateCustomers(completedOrders),
          salesByDay: getDailySales(completedOrders),
          salesByPaymentMethod: aggregatePayments(completedOrders),
        };
      },
    }),
    {
      name: "sales-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
