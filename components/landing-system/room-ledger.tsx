"use client"

import { Minus, Plus } from "lucide-react"

export interface RoomDef {
  id: string
  name: string
  description: string
  price: number
  priceLabel?: string
  available?: number
  roomNumbers?: string
}

interface RoomLedgerProps {
  rooms: RoomDef[]
  interactive?: boolean
  selectedQuantities?: Record<string, number>
  onQuantityChange?: (roomId: string, qty: number) => void
}

export function RoomLedger({ rooms, interactive = false, selectedQuantities = {}, onQuantityChange }: RoomLedgerProps) {
  
  return (
    <div className="w-full flex flex-col gap-6">
      {rooms.map((room, index) => {
        const qty = selectedQuantities[room.id] || 0
        const available = room.available ?? 0
        const isSoldOut = interactive && available === 0
        const isLowStock = interactive && available > 0 && available <= 2

        return (
          <div key={room.id} className="relative flex flex-col md:flex-row md:items-center gap-4 py-6 border-b border-primary/20 group">
            
            {/* Number */}
            <div className="font-mono text-muted-foreground text-sm md:w-16 shrink-0 font-bold">
              {(index + 1).toString().padStart(2, '0')}
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl md:text-2xl text-foreground">
                  {room.name}
                </h3>
                {isLowStock && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold bg-destructive/20 text-destructive border border-destructive/30">
                    {available} left
                  </span>
                )}
                {isSoldOut && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold bg-card text-muted-foreground border border-muted-foreground/20">
                    Sold Out
                  </span>
                )}
              </div>
              <p className="font-sans text-muted-foreground text-sm font-light">
                {room.description} {room.roomNumbers && <span className="font-mono opacity-60 ml-2">({room.roomNumbers})</span>}
              </p>
            </div>

            {/* Price & Stepper */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-4 md:mt-0 gap-4 shrink-0">
              <div className="text-left md:text-right">
                <div className="font-mono text-primary text-lg font-bold">
                  ₹{room.price.toLocaleString()}
                </div>
                <div className="font-mono text-muted-foreground text-xs font-bold">
                  {room.priceLabel || "/night"}
                </div>
              </div>

              {interactive && (
                <div className="flex items-center gap-3 bg-card p-1 rounded-md border border-border">
                  <button
                    type="button"
                    disabled={qty <= 0}
                    onClick={() => onQuantityChange?.(room.id, qty - 1)}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono text-foreground w-4 text-center text-sm font-bold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    disabled={qty >= available}
                    onClick={() => onQuantityChange?.(room.id, qty + 1)}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
