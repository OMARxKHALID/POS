"use client";

import { PageHeader } from "@/components/shared/page-header";
import { CategoryNav } from "@/components/pos/category-nav";
import { SearchBar } from "@/components/pos/search-bar";
import { MenuGrid } from "@/components/pos/menu-grid";
import { OrderCart } from "@/components/pos/order-cart";
import { ItemDetailModal } from "@/components/pos/item-detail-modal";
import { useState } from "react";
import type { MenuItem } from "@/types/pos";

export default function PosPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCart = () => setCartOpen((prev) => !prev);

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Layout */}
      <div className="flex flex-col h-full lg:hidden">
        <div className="flex flex-col flex-1 bg-white/90 backdrop-blur-sm m-2 rounded-lg shadow-sm border border-white/60 overflow-hidden">
          <div className="flex-shrink-0 px-4 py-3">
            <PageHeader
              title="POS System"
              showCartToggle
              toggleCart={toggleCart}
              showDashboard
            />
            <CategoryNav
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <MenuGrid
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onItemSelect={setSelectedItem}
            />
          </div>
        </div>

        {/* Mobile Cart Overlay */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm">
            <div className="absolute inset-x-0 bottom-0 top-0">
              <OrderCart cartOpen={cartOpen} toggleCart={toggleCart} isMobile />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full p-4 gap-4">
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/60 overflow-hidden flex flex-col">
          <div className="flex-shrink-0 px-6 py-4">
            <PageHeader
              title="POS System"
              showCartToggle
              toggleCart={toggleCart}
              showDashboard
            />
            <CategoryNav
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <MenuGrid
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onItemSelect={setSelectedItem}
            />
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            cartOpen ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          <OrderCart cartOpen={cartOpen} toggleCart={toggleCart} />
        </div>
      </div>

      <ItemDetailModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
