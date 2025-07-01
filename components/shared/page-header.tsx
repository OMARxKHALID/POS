"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, ShoppingCart, BarChart3, Store } from "lucide-react"
import { StatusIndicator } from "@/components/ui/status-indicator"
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
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-quantico">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 font-quantico">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="font-quantico">{dateString}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-quantico">{timeString}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusIndicator status={orderType} />

        {showDashboard && (
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-quantico bg-transparent">
              <BarChart3 className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
        )}

        {showPOS && (
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-quantico bg-transparent">
              <Store className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">POS</span>
            </Button>
          </Link>
        )}

        {showCartToggle && (
          <Button
            variant="outline"
            size="sm"
            className="relative h-8 px-3 text-xs font-quantico bg-transparent"
            onClick={toggleCart}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {totalItems}
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
