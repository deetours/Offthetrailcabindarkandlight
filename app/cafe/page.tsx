"use client"

import { useState, useEffect } from "react"
import { CafeHero } from "@/components/cafe/cafe-hero"
import { CafeMenu, CartItem } from "@/components/cafe/cafe-menu"
import { CafeCartDrawer } from "@/components/cafe/cafe-cart-drawer"
import { Navbar } from "@/components/ui/navbar"
import { ShoppingBag } from "lucide-react"

export default function CafePage() {
  const [showNavbar, setShowNavbar] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAddToCart = (item: CartItem) => {
    setCart(prev => [...prev, item])
    setCartOpen(true)
  }

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const cartQuantity = cart.length

  return (
    <main className="grain min-h-screen bg-background relative overflow-x-hidden">
      <Navbar visible={showNavbar} />

      <CafeHero />
      <CafeMenu onAddToCart={handleAddToCart} />

      <CafeCartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cart={cart}
        onRemoveItem={handleRemoveItem}
      />

      {/* Floating Cart Button for Mobile & Desktop when cart has items */}
      {cartQuantity > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex items-center justify-center gap-2 bg-primary text-black px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-transform"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Order ({cartQuantity})</span>
        </button>
      )}
    </main>
  )
}
