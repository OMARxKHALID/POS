"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/data/menu-data"

interface CategoryNavProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-all flex-shrink-0 font-quantico"
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="text-base">{category.icon}</span>
          <span>{category.name}</span>
          <Badge variant="secondary" className="text-xs font-quantico">
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  )
}
