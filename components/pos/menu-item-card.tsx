"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PriceDisplay } from "@/components/ui/price-display"
import type { MenuItem } from "@/types/pos"

interface MenuItemCardProps {
  item: MenuItem
  onSelect: (item: MenuItem) => void
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 group"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-3">
        <div className="flex flex-col items-center text-center h-full">
          <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted rounded-lg mb-3 group-hover:from-primary/10 group-hover:to-primary/20 transition-colors">
            <span className="text-4xl">{item.icon}</span>
          </div>
          <div className="flex-1 flex flex-col justify-between w-full min-h-0">
            <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 font-quantico">{item.name}</h3>
            <PriceDisplay price={item.price} size="sm" className="justify-center" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
