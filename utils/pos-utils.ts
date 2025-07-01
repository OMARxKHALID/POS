import type { CartItem, OrderTotals } from "@/types/pos"

export function calculateOrderTotals(orderItems: CartItem[], cartDiscount = 0): OrderTotals {
  const subtotal = orderItems.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity
    const itemDiscount = (item.discount || 0) / 100
    const discountedPrice = itemPrice * (1 - itemDiscount)
    return sum + discountedPrice
  }, 0)

  const cartDiscountAmount = (cartDiscount / 100) * subtotal
  const discountedSubtotal = subtotal - cartDiscountAmount
  const taxRate = 0.1
  const tax = discountedSubtotal * taxRate
  const total = discountedSubtotal + tax

  return {
    subtotal,
    tax,
    discount: cartDiscountAmount,
    total,
    itemDiscounts: orderItems.reduce((sum, item) => {
      const itemPrice = item.price * item.quantity
      const itemDiscount = (item.discount || 0) / 100
      return sum + itemPrice * itemDiscount
    }, 0),
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `ORD-${timestamp}-${random}`
}

export function normalizeString(str: string): string {
  return (str || "").toLowerCase().trim()
}
