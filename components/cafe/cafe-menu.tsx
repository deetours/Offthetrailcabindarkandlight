"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CAFE_DATA } from "@/lib/cafe-data"
import { Plus } from "lucide-react"

export type CartItem = {
  id: string
  itemId: string
  name: string
  price: number
  variant?: string
  quantity: number
}

interface CafeMenuProps {
  cart: CartItem[]
  onAddToCart: (item: Omit<CartItem, 'id'>) => void
  onUpdateQuantity: (itemId: string, delta: number) => void
}

export function CafeMenu({ cart, onAddToCart, onUpdateQuantity }: CafeMenuProps) {
  const [activeCategory, setActiveCategory] = useState(CAFE_DATA.categories[0].id)

  const scrollToCategory = (id: string) => {
    setActiveCategory(id)
    const element = document.getElementById(`category-${id}`)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative w-full bg-background px-6 py-12 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-12 relative">
        
        {/* Sticky Sidebar Navigation */}
        <div className="md:w-1/4">
          <div className="sticky top-24 flex flex-row md:flex-col overflow-x-auto no-scrollbar gap-2 md:gap-4 pb-4 md:pb-0">
            {CAFE_DATA.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 text-left text-sm font-bold uppercase tracking-widest transition-colors rounded-lg ${
                  activeCategory === cat.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="md:w-3/4 space-y-16">
          {CAFE_DATA.categories.map(category => (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
              <h2 className="font-serif text-3xl text-foreground mb-6 pb-2 border-b border-border">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CAFE_DATA.items.filter(item => item.categoryId === category.id).map(item => {
                  const cartItem = cart.find(c => c.itemId === item.id)
                  const quantity = cartItem?.quantity || 0

                  return (
                    <div key={item.id} className={`group relative rounded-xl border ${quantity > 0 ? 'border-primary/50 bg-primary/5' : 'border-border bg-card/70'} p-5 hover:bg-card transition-colors`}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {item.isVeg !== undefined && (
                              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : (item.containsEgg ? 'bg-yellow-500' : 'bg-red-500')}`} title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"} />
                            )}
                            <h3 className="font-bold text-foreground text-base">{item.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.description}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-primary font-medium text-sm">
                            {item.priceVaries ? 'from ' : ''}₹{item.basePrice}
                          </span>
                        </div>
                      </div>

                      {quantity > 0 ? (
                        <div className="flex items-center justify-between bg-background border border-primary/20 rounded-lg mt-2 overflow-hidden h-10">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-6 h-full text-primary hover:bg-primary/10 transition-colors flex items-center justify-center active:scale-95"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs text-primary">{quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-6 h-full text-primary hover:bg-primary/10 transition-colors flex items-center justify-center active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => onAddToCart({ itemId: item.id, name: item.name, price: item.basePrice, quantity: 1 })}
                          className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-accent border border-border text-foreground h-10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors mt-2 active:scale-95"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
