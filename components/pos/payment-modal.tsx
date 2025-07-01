"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { useState } from "react"
import type { PaymentMethod } from "@/types/pos"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onConfirm: (customerName: string, paymentMethod: string) => void
}

export function PaymentModal({ open, onOpenChange, total, onConfirm }: PaymentModalProps) {
  const [customerName, setCustomerName] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("cash")

  const paymentMethods = [
    { value: "cash" as const, label: "Cash", icon: Banknote },
    { value: "card" as const, label: "Credit Card", icon: CreditCard },
    { value: "mobile" as const, label: "Mobile Pay", icon: Smartphone },
  ]

  const handleConfirm = () => {
    onConfirm(customerName, selectedPaymentMethod)
    setCustomerName("")
    setSelectedPaymentMethod("cash")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-quantico">Complete Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer-name" className="text-sm font-medium font-quantico">
              Customer Name (Optional)
            </Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="mt-1 font-quantico"
            />
          </div>

          <div>
            <Label className="text-sm font-medium font-quantico">Payment Method</Label>
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger className="mt-1 font-quantico">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2 font-quantico">
                        <Icon className="w-4 h-4" />
                        {method.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between font-bold text-lg font-quantico">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleConfirm} className="w-full font-quantico">
            Complete Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
