'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import CartItemRow from '@/components/CartItemRow'

interface CartClientProps {
  initialItems: any[]
}

export default function CartClient({ initialItems }: CartClientProps) {
  // Semua item dicentang secara default
  const [selectedIds, setSelectedIds] = useState<string[]>(initialItems.map(item => item.id))

  const toggleItem = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === initialItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(initialItems.map(item => item.id))
    }
  }

  const selectedItems = useMemo(() => 
    initialItems.filter(item => selectedIds.includes(item.id)),
    [initialItems, selectedIds]
  )

  const subtotal = selectedItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* List Items */}
      <div className="lg:col-span-2 space-y-4">
        {initialItems.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 mb-2">
            <input 
              type="checkbox" 
              checked={selectedIds.length === initialItems.length && initialItems.length > 0}
              onChange={toggleAll}
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
            />
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-bold">Select All Gear</span>
          </div>
        )}

        {initialItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <input 
              type="checkbox" 
              checked={selectedIds.includes(item.id)}
              onChange={() => toggleItem(item.id)}
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
            />
            <div className="flex-1">
              <CartItemRow item={item} />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-32 space-y-8" hover={false}>
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold border-b border-white/5 pb-6">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500 font-light italic">Selected Items</span>
              <span className="text-sm font-medium">{selectedIds.length} Products</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-light italic">Subtotal</span>
              <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-light italic">Shipping</span>
              <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Free</span>
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400">Total Amount</span>
              <span className="text-3xl font-black tracking-tighter text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Link 
            href={selectedIds.length > 0 ? `/checkout?items=${selectedIds.join(',')}` : '#'}
            className={`w-full h-16 flex items-center justify-center rounded-2xl bg-secondary text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-2xl shadow-secondary/20 ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
          >
            Proceed to Checkout
          </Link>

          <Link 
            href="/products" 
            className="w-full h-14 rounded-2xl border border-white/5 text-zinc-500 flex items-center justify-center text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-white/5 hover:text-white transition-all duration-500"
          >
            Back to Catalog
          </Link>
        </Card>
      </div>
    </div>
  )
}
