"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Trash2, Percent, Receipt, Settings } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { useSalesStore } from "@/hooks/use-sales-store";
import { OrderItem } from "./order-item";
import { PaymentModal } from "./payment-modal";
import { DiscountModal } from "./discount-modal";
import { ReceiptGenerator } from "./receipt-generator";
import { useState, useMemo, useEffect } from "react";
import { calculateOrderTotals, generateOrderNumber } from "@/utils/pos-utils";
import type { SalesOrder } from "@/types/pos";

interface OrderCartProps {
  cartOpen?: boolean;
  toggleCart?: () => void;
  isMobile?: boolean;
}

export function OrderCart({
  cartOpen = false,
  toggleCart = () => {},
  isMobile = false,
}: OrderCartProps) {
  const { orderItems, clearCart, cartDiscount } = useCartStore();
  const { addOrder } = useSalesStore();
  const [localOrderNumber, setLocalOrderNumber] = useState<string | null>(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [lastOrderData, setLastOrderData] = useState<SalesOrder | null>(null);

  const totals = useMemo(
    () => calculateOrderTotals(orderItems, cartDiscount),
    [orderItems, cartDiscount]
  );

  useEffect(() => {
    setLocalOrderNumber(generateOrderNumber());
  }, []);

  const handlePlaceOrder = (customerName: string, paymentMethod: string) => {
    if (!orderItems.length || !localOrderNumber) return;

    const now = new Date();
    const orderData: SalesOrder = {
      id: crypto.randomUUID(),
      items: orderItems,
      customerName: customerName.trim() || "Guest",
      orderNumber: localOrderNumber,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount + totals.itemDiscounts,
      total: totals.total,
      paymentMethod,
      status: "completed",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: now.getTime(),
    };

    addOrder(orderData);
    setLastOrderData(orderData);
    setPrintReceipt(true);
    clearCart();
    setPaymentModalOpen(false);
    if (isMobile) toggleCart();
  };

  const CartHeader = () => (
    <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <Receipt className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground font-quantico">
              {localOrderNumber ?? ""}
            </h2>
            <p className="text-xs text-muted-foreground font-quantico">
              {orderItems.length} items •{" "}
              {orderItems.reduce((sum, item) => sum + item.quantity, 0)} qty
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleCart}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {cartDiscount > 0 && (
        <div className="mt-3 flex justify-end">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 font-quantico"
          >
            {cartDiscount}% Cart Discount
          </Badge>
        </div>
      )}
    </CardHeader>
  );

  const CartFooter = () => (
    <CardContent className="pt-0">
      <div className="space-y-2 mb-4 text-sm font-quantico">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        {totals.itemDiscounts > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Item Discounts</span>
            <span>-${totals.itemDiscounts.toFixed(2)}</span>
          </div>
        )}
        {totals.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Cart Discount</span>
            <span>-${totals.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full h-10 font-bold font-quantico"
          onClick={() => setPaymentModalOpen(true)}
          disabled={orderItems.length === 0}
        >
          <Receipt className="w-4 h-4 mr-2" />
          Checkout - ${totals.total.toFixed(2)}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs font-quantico bg-transparent"
            onClick={() => setDiscountModalOpen(true)}
          >
            <Percent className="w-3 h-3 mr-1" />
            Discount
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs font-quantico bg-transparent"
            onClick={clearCart}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>
    </CardContent>
  );

  const EmptyCart = () => (
    <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <div className="text-6xl mb-4">🛒</div>
      <p className="text-base font-quantico">Cart is empty</p>
      <p className="text-sm mt-1">Add items to get started</p>
    </CardContent>
  );

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden">
        <CartHeader />

        <CardContent className="flex-1 overflow-y-auto p-3">
          {orderItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-3">
              {orderItems.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>

        {orderItems.length > 0 && <CartFooter />}
      </Card>

      <DiscountModal
        open={discountModalOpen}
        onOpenChange={setDiscountModalOpen}
        currentDiscount={cartDiscount}
        type="cart"
      />

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        total={totals.total}
        onConfirm={handlePlaceOrder}
      />

      <ReceiptGenerator
        open={printReceipt}
        orderData={lastOrderData}
        totals={totals}
        onPrinted={() => setPrintReceipt(false)}
      />
    </>
  );
}
