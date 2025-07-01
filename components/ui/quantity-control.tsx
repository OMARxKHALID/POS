"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantityControlProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  min?: number
  max?: number
  size?: "sm" | "md" | "lg"
}

export function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max = 99,
  size = "md",
}: QuantityControlProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  const textSizeClasses = {
    sm: "w-6 text-xs",
    md: "w-8 text-sm",
    lg: "w-10 text-base",
  }

  return (
    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        className={`${sizeClasses[size]} p-0 hover:bg-gray-100`}
        onClick={onDecrease}
        disabled={quantity <= min}
      >
        <Minus className="w-3 h-3" />
      </Button>
      <span className={`${textSizeClasses[size]} text-center font-bold font-quantico`}>{quantity}</span>
      <Button
        variant="ghost"
        size="sm"
        className={`${sizeClasses[size]} p-0 hover:bg-gray-100`}
        onClick={onIncrease}
        disabled={quantity >= max}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  )
}
