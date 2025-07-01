"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Edit3 } from "lucide-react";
import { QuantityControl } from "@/components/ui/quantity-control";
import { DiscountModal } from "./discount-modal";
import { useHydratedCartStore } from "@/hooks/use-cart-store";
import { useState } from "react";
import type { CartItem } from "@/types/pos";

interface OrderItemProps {
  item: CartItem;
}

export function OrderItem({ item }: OrderItemProps) {
  const cartStore = useHydratedCartStore();
  const [discountModalOpen, setDiscountModalOpen] = useState(false);

  const handleDecrease = () => {
    if (!cartStore) return;

    if (item.quantity <= 1) {
      cartStore.removeFromCart(item.id);
    } else {
      cartStore.updateQuantity(item.id, item.quantity - 1);
    }
  };

  const originalPrice = item.price * item.quantity;
  const discountAmount = originalPrice * ((item.discount || 0) / 100);
  const finalPrice = originalPrice - discountAmount;

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-sm bg-white/80 border-gray-200 rounded-md overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-md flex items-center justify-center border border-primary/20 flex-shrink-0">
              <span className="text-3xl">{item.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-xs text-foreground font-quantico mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-quantico">
                    $ {item.price.toFixed(2)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-sm"
                  onClick={() => cartStore?.removeFromCart(item.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QuantityControl
                    quantity={item.quantity}
                    onDecrease={handleDecrease}
                    onIncrease={() =>
                      cartStore?.updateQuantity(item.id, item.quantity + 1)
                    }
                    size="sm"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] font-quantico text-blue-600 hover:bg-blue-50 rounded-sm"
                    onClick={() => setDiscountModalOpen(true)}
                  >
                    <Edit3 className="w-2 h-2 mr-1" />
                    {(item.discount || 0) > 0 ? `${item.discount}%` : "Edit"}
                  </Button>
                </div>

                <div className="text-right">
                  {(item.discount || 0) > 0 && (
                    <span className="text-[10px] text-gray-400 line-through font-quantico block">
                      $ {originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-foreground font-quantico">
                    $ {finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {(item.discount || 0) > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Badge className="bg-green-50 text-green-700 font-quantico border-0 text-[10px] h-4">
                    {item.discount}% Discount Applied
                  </Badge>
                </div>
              )}
            </div>
          </div>
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
  );
}
