"use client"

import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  discount?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PriceDisplay({ price, originalPrice, discount, size = "md", className }: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className={cn("text-center", className)}>
      <div className="flex flex-col items-center">
        {originalPrice && originalPrice > price && (
          <span className="text-xs text-gray-400 line-through font-quantico">${originalPrice.toFixed(2)}</span>
        )}
        <span className={cn("font-bold text-gray-900 font-quantico", sizeClasses[size])}>${price.toFixed(2)}</span>
        {discount && discount > 0 && (
          <span className="text-xs text-green-600 font-medium font-quantico">
            Save ${(originalPrice! - price).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  )
}
