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

  const handleAddToCart = (item: Omit<CartItem, "id">) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.itemId === item.itemId)
      if (existingItem) {
        return prev.map(i => i.itemId === item.itemId ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }]
    })
    // No longer opening modal here - Instant Add
  }

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.itemId === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <main className="grain min-h-screen bg-background relative overflow-x-hidden pb-24 md:pb-0">
      <Navbar visible={showNavbar} />

      <CafeHero />
      <CafeMenu 
        cart={cart}
        onAddToCart={handleAddToCart} 
        onUpdateQuantity={handleUpdateQuantity}
      />

      <CafeCartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onAddItem={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Persistent View Order Bar (Sticky on Mobile, Floating on Desktop) */}
      {cartQuantity > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:bottom-10 md:right-10 md:left-auto md:w-auto p-4 md:p-0 bg-background/80 backdrop-blur-xl border-t border-border md:border-none md:bg-transparent">
          <div className="max-w-7xl mx-auto flex items-center justify-between md:justify-end">
            <div className="md:hidden flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{cartQuantity} item{cartQuantity > 1 ? 's' : ''}</span>
              <span className="text-primary font-bold">₹{cartTotal}</span>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center justify-center gap-2 bg-primary text-black px-6 py-4 rounded-xl md:rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Order <span className="hidden md:inline">({cartQuantity})</span></span>
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
