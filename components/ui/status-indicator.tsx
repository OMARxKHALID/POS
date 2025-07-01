"use client"

import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "open" | "closed" | "busy" | "available"
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function StatusIndicator({ status, size = "md", showText = true, className }: StatusIndicatorProps) {
  const statusConfig = {
    open: { color: "text-green-500 fill-green-500", text: "Open", textColor: "text-green-600" },
    closed: { color: "text-red-500 fill-red-500", text: "Closed", textColor: "text-red-600" },
    busy: { color: "text-yellow-500 fill-yellow-500", text: "Busy", textColor: "text-yellow-600" },
    available: { color: "text-blue-500 fill-blue-500", text: "Available", textColor: "text-blue-600" },
  }

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  const config = statusConfig[status]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Circle className={cn(sizeClasses[size], config.color)} />
      {showText && <span className={cn("text-xs font-medium font-quantico", config.textColor)}>{config.text}</span>}
    </div>
  )
}
