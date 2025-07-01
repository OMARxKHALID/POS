"use client";

import { categories } from "@/data/menu-data";

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({
  selectedCategory,
  onCategoryChange,
}: CategoryNavProps) {
  return (
    <div className="flex gap-5 mb-6 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`flex flex-col items-start p-3 rounded-2xl transition-all duration-200 w-[100px] h-[100px] border-2 ${
            selectedCategory === category.id
              ? "bg-blue-50 border-blue-400"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          <div className="mb-3">
            {selectedCategory === category.id ? (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                {category.icon === "🍽️" ? (
                  <span className="text-white text-xs">🍽️</span>
                ) : (
                  <span className="text-white text-xs">{category.icon}</span>
                )}
              </div>
            ) : (
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-gray-400 text-lg">{category.icon}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col text-left w-full">
            <h3 className="text-gray-900 font-medium text-sm mb-1 leading-tight text-left">
              {category.name}
            </h3>
            <p className="text-gray-500 text-xs text-left">
              {category.count} Items
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
