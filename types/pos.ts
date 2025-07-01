export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  icon: string
  category: string
  notes?: string
  discount?: number
}

export interface OrderTotals {
  subtotal: number
  tax: number
  discount: number
  total: number
  itemDiscounts: number
}

export interface SalesOrder {
  id: string
  orderNumber: string
  customerName: string
  items: CartItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  status: "completed" | "pending" | "cancelled"
  date: string
  time: string
  timestamp: number
}

export type PaymentMethod = "cash" | "card" | "mobile"

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  icon: string
  description: string
  image: string
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}
