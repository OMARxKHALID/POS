"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/hooks/use-cart-store";
import Image from "next/image";
import type { MenuItem } from "@/types/pos";

interface ItemDetailModalProps {
  selectedItem: MenuItem | null;
  onClose: () => void;
}

export function ItemDetailModal({
  selectedItem,
  onClose,
}: ItemDetailModalProps) {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedItem) {
      setQuantity(1);
    }
  }, [selectedItem]);

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, quantity);
    onClose();
  };

  if (!selectedItem) return null;

  const {
    name,
    image,
    icon,
    category = "Uncategorized",
    price,
    description,
  } = selectedItem;

  return (
    <Dialog open={!!selectedItem} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-0 bg-transparent border-0 shadow-none">
        <Card className="border-0 shadow-lg bg-card rounded-lg overflow-hidden">
          <CardContent className="p-4">
            <DialogTitle className="text-base font-semibold text-center text-foreground mb-3 font-quantico">
              Detail Menu
            </DialogTitle>

            <div className="relative w-full h-32 mx-auto mb-3 overflow-hidden rounded-md bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
              {image ? (
                <div className="text-7xl text-muted-foreground">
                  {icon || "🍔"}
                </div>
              ) : (
                <div className="text-7xl text-muted-foreground">
                  {icon || "🍔"}
                </div>
              )}
            </div>

            <div className="text-center mb-3">
              <Badge
                variant="secondary"
                className="mb-2 font-quantico text-[10px] h-4 px-2"
              >
                <Package className="w-2 h-2 mr-1" />
                {category}
              </Badge>
              <h3 className="text-sm font-semibold text-foreground font-quantico mb-1">
                {name}
              </h3>
              {description && (
                <p className="text-xs text-muted-foreground mb-2 font-quantico">
                  {description}
                </p>
              )}
              <p className="text-lg font-bold text-primary font-quantico">
                ${price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-md bg-transparent"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center text-sm font-semibold font-quantico">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-md bg-transparent"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <Button
              className="w-full h-9 text-sm font-medium font-quantico rounded-md"
              onClick={handleAddToCart}
            >
              Add to Cart (${(price * quantity).toFixed(2)})
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
