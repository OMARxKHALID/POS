"use client"

import { PageHeader } from "@/components/shared/page-header"
import { CategoryNav } from "@/components/pos/category-nav"
import { SearchBar } from "@/components/pos/search-bar"
import { MenuGrid } from "@/components/pos/menu-grid"
import { OrderCart } from "@/components/pos/order-cart"
import { ItemDetailModal } from "@/components/pos/item-detail-modal"
import { useState } from "react"
import type { MenuItem } from "@/types/pos"

export default function PosPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleCart = () => setCartOpen((prev) => !prev)

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      {/* Mobile Layout */}
      <div className="flex flex-col h-full lg:hidden">
        <div className="flex flex-col flex-1 bg-card m-2 rounded-xl shadow-sm border overflow-hidden">
          <div className="flex-shrink-0 px-4 py-3 border-b">
            <PageHeader title="POS System" showCartToggle toggleCart={toggleCart} showDashboard />
            <CategoryNav selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div className="flex-1 overflow-hidden">
            <MenuGrid selectedCategory={selectedCategory} searchQuery={searchQuery} onItemSelect={setSelectedItem} />
          </div>
        </div>

        {/* Mobile Cart Overlay */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-x-0 bottom-0 top-0">
              <OrderCart cartOpen={cartOpen} toggleCart={toggleCart} isMobile />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full p-4 gap-4">
        <div className="flex-1 bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col">
          <div className="flex-shrink-0 px-6 py-4 border-b">
            <PageHeader title="POS System" showCartToggle toggleCart={toggleCart} showDashboard />
            <CategoryNav selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div className="flex-1 overflow-hidden">
            <MenuGrid selectedCategory={selectedCategory} searchQuery={searchQuery} onItemSelect={setSelectedItem} />
          </div>
        </div>

        <div className={`transition-all duration-300 ease-in-out ${cartOpen ? "w-96" : "w-0"} overflow-hidden`}>
          <OrderCart cartOpen={cartOpen} toggleCart={toggleCart} />
        </div>
      </div>

      <ItemDetailModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
