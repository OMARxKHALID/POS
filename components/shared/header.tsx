"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, Circle, ShoppingCart, BarChart3, Store } from "lucide-react"
import { useCartStore } from "@/hooks/use-cart-store"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showCartToggle?: boolean
  showDashboard?: boolean
  showPOS?: boolean
  toggleCart?: () => void
  orderType?: "open" | "closed"
}

export function PageHeader({
  title,
  subtitle,
  showCartToggle = false,
  showDashboard = false,
  showPOS = false,
  toggleCart = () => {},
  orderType = "open",
}: PageHeaderProps) {
  const { orderItems } = useCartStore()
  const currentDate = new Date()
  const dateString = currentDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const timeString = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex items-center justify-between mb-4 font-zen">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{dateString}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{timeString}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Circle
            className={`h-2 w-2 ${
              orderType === "open" ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"
            }`}
          />
          <span className={`text-xs font-medium ${orderType === "open" ? "text-green-600" : "text-red-600"}`}>
            {orderType === "open" ? "Open" : "Closed"}
          </span>
        </div>

        {showDashboard && (
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-zen bg-transparent">
              <BarChart3 className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
        )}

        {showPOS && (
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-zen bg-transparent">
              <Store className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">POS</span>
            </Button>
          </Link>
        )}

        {showCartToggle && (
          <Button
            variant="outline"
            size="sm"
            className="relative h-8 px-3 text-xs font-zen bg-transparent"
            onClick={toggleCart}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {totalItems}
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
