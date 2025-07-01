"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCartStore } from "@/hooks/use-cart-store"
import { useState, useEffect } from "react"

interface DiscountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDiscount: number
  type: "item" | "cart"
  itemId?: string
  itemName?: string
}

export function DiscountModal({ open, onOpenChange, currentDiscount, type, itemId, itemName }: DiscountModalProps) {
  const { applyItemDiscount, applyCartDiscount, removeItemDiscount, removeCartDiscount } = useCartStore()
  const [tempDiscount, setTempDiscount] = useState("")

  useEffect(() => {
    if (open) {
      setTempDiscount(currentDiscount.toString())
    }
  }, [open, currentDiscount])

  const handleApplyDiscount = () => {
    const discount = Math.max(0, Math.min(100, Number.parseFloat(tempDiscount) || 0))

    if (type === "item" && itemId) {
      applyItemDiscount(itemId, discount)
    } else if (type === "cart") {
      applyCartDiscount(discount)
    }

    onOpenChange(false)
  }

  const handleRemoveDiscount = () => {
    if (type === "item" && itemId) {
      removeItemDiscount(itemId)
    } else if (type === "cart") {
      removeCartDiscount()
    }

    onOpenChange(false)
  }

  const title = type === "item" ? `Item Discount - ${itemName}` : "Apply Cart Discount"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-quantico">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="discount" className="text-sm font-medium font-quantico">
              Discount Percentage
            </Label>
            <Input
              id="discount"
              type="number"
              value={tempDiscount}
              onChange={(e) => setTempDiscount(e.target.value)}
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              className="mt-1 font-quantico"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApplyDiscount} className="flex-1 font-quantico">
              Apply
            </Button>
            <Button variant="outline" onClick={handleRemoveDiscount} className="flex-1 font-quantico bg-transparent">
              Remove
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
