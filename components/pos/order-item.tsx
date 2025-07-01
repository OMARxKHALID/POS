"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Percent } from "lucide-react"
import { QuantityControl } from "@/components/ui/quantity-control"
import { PriceDisplay } from "@/components/ui/price-display"
import { DiscountModal } from "./discount-modal"
import { useCartStore } from "@/hooks/use-cart-store"
import { useState } from "react"
import type { CartItem } from "@/types/pos"

interface OrderItemProps {
  item: CartItem
}

export function OrderItem({ item }: OrderItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore()
  const [discountModalOpen, setDiscountModalOpen] = useState(false)

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      removeFromCart(item.id)
    } else {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const originalPrice = item.price * item.quantity
  const discountAmount = originalPrice * ((item.discount || 0) / 100)
  const finalPrice = originalPrice - discountAmount

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate font-quantico">{item.name}</h4>
                <p className="text-xs text-muted-foreground font-quantico">${item.price.toFixed(2)} each</p>
                {item.notes && (
                  <Badge variant="secondary" className="mt-1 text-xs font-quantico">
                    {item.notes}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
              onClick={() => removeFromCart(item.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QuantityControl
                quantity={item.quantity}
                onDecrease={handleDecrease}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                size="sm"
              />

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-quantico bg-transparent"
                onClick={() => setDiscountModalOpen(true)}
              >
                <Percent className="w-3 h-3 mr-1" />
                {(item.discount || 0) > 0 ? `${item.discount}%` : "Disc"}
              </Button>
            </div>

            <PriceDisplay price={finalPrice} originalPrice={originalPrice} discount={item.discount} size="sm" />
          </div>

          {/* Discount Badge */}
          {(item.discount || 0) > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Badge className="bg-green-100 text-green-800 font-quantico">{item.discount}% OFF Applied</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <DiscountModal
        open={discountModalOpen}
        onOpenChange={setDiscountModalOpen}
        currentDiscount={item.discount || 0}
        type="item"
        itemId={item.id}
        itemName={item.name}
      />
    </>
  )
}
