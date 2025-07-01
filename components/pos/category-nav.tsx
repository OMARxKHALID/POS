"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/menu-data";

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({
  selectedCategory,
  onCategoryChange,
}: CategoryNavProps) {
  const getCategoryColor = (categoryId: string) => {
    const colors = {
      all: "bg-blue-50 text-blue-700 border-blue-100",
      burgers: "bg-orange-50 text-orange-700 border-orange-100",
      pizza: "bg-red-50 text-red-700 border-red-100",
      drinks: "bg-cyan-50 text-cyan-700 border-cyan-100",
      desserts: "bg-pink-50 text-pink-700 border-pink-100",
    };
    return (
      colors[categoryId as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-100"
    );
  };

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          className={`flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-medium transition-all flex-shrink-0 font-quantico ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : `bg-white/70 border-gray-200 hover:bg-white ${getCategoryColor(
                  category.id
                )}`
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="text-sm">{category.icon}</span>
          <span>{category.name}</span>
          <Badge
            variant="secondary"
            className={`text-[10px] font-quantico h-4 px-1 ${
              selectedCategory === category.id
                ? "bg-white/20 text-white"
                : "bg-white/80"
            }`}
          >
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
