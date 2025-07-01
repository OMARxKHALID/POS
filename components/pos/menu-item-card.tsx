"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@/types/pos";

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      burgers: "bg-orange-50 text-orange-700",
      pizza: "bg-red-50 text-red-700",
      drinks: "bg-cyan-50 text-cyan-700",
      desserts: "bg-pink-50 text-pink-700",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-50 text-gray-700"
    );
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md group bg-white/80 backdrop-blur-sm border-gray-200 rounded-lg overflow-hidden"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-3">
        <div className="flex flex-col h-full items-center text-center">
          <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-md mb-3 group-hover:from-primary/5 group-hover:to-primary/10 transition-colors overflow-hidden">
            <span className="text-5xl">{item.icon}</span>
          </div>

          <div className="flex-1 flex flex-col items-center text-center">
            <div className="mb-2">
              <h3 className="font-medium text-sm leading-tight mb-1 text-gray-900 font-quantico line-clamp-2">
                {item.name}
              </h3>
              <Badge
                variant="secondary"
                className={`text-[10px] font-quantico h-4 px-1 ${getCategoryColor(
                  item.category
                )} border-0`}
              >
                {item.category}
              </Badge>
            </div>

            <div className="mt-auto text-center">
              <p className="text-sm font-semibold text-primary font-quantico">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
