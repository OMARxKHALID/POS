"use client";

import { categories } from "@/data/menu-data";

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

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

export function CategoryNav({
  selectedCategory,
  onCategoryChange,
}: CategoryNavProps) {
  return (
    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`flex flex-col items-start p-2 rounded-2xl transition-all duration-200 w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] border-2 flex-shrink-0 ${
            selectedCategory === category.id
              ? "bg-blue-50 border-blue-400"
              : `bg-white ${getCategoryColor(category.id)}`
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          <div className="mb-2 sm:mb-3">
            {selectedCategory === category.id ? (
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-500 rounded-full flex items-center justify-center">
                {category.icon === "🍽️" ? (
                  <span className="text-white text-sm sm:text-lg">🍽️</span>
                ) : (
                  <span className="text-white text-sm sm:text-lg">
                    {category.icon}
                  </span>
                )}
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center">
                <span className="text-gray-400 text-lg sm:text-xl">
                  {category.icon}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col text-left w-full">
            <h3 className="text-gray-900 font-medium text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight text-left">
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
