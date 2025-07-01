"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { QuantityControl } from "@/components/ui/quantity-control"
import { PriceDisplay } from "@/components/ui/price-display"
import { useCartStore } from "@/hooks/use-cart-store"
import Image from "next/image"
import type { MenuItem } from "@/types/pos"

interface ItemDetailModalProps {
  selectedItem: MenuItem | null
  onClose: () => void
}

export function ItemDetailModal({ selectedItem, onClose }: ItemDetailModalProps) {
  const { addToCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (selectedItem) {
      setQuantity(1)
    }
  }, [selectedItem])

  const handleAddToCart = () => {
    if (!selectedItem) return
    addToCart(selectedItem, quantity)
    onClose()
  }

  if (!selectedItem) return null

  const { name, image, icon, category = "Uncategorized", price, description } = selectedItem

  return (
    <Dialog open={!!selectedItem} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none">
        <Card className="border-0 shadow-2xl bg-card rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <DialogTitle className="text-xl font-bold text-center text-foreground mb-4 font-quantico">
              {name}
            </DialogTitle>

            <div className="relative w-full h-40 mx-auto mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
              {image ? (
                <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
              ) : (
                <div className="text-6xl text-muted-foreground">{icon || "🍔"}</div>
              )}
            </div>

            <div className="text-center mb-4">
              <Badge variant="secondary" className="mb-3 font-quantico">
                <Package className="w-3 h-3 mr-1" />
                {category}
              </Badge>
              <PriceDisplay price={price} size="lg" className="mb-3 justify-center" />
              {description && <p className="text-sm text-muted-foreground mb-4 font-quantico">{description}</p>}
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-foreground font-quantico">Quantity</span>
              <QuantityControl
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
                size="md"
              />
            </div>

            <Button className="w-full h-12 text-sm font-bold font-quantico" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart - ${(price * quantity).toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
