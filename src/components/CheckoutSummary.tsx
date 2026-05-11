'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import CheckoutButton from '@/components/CheckoutButton'

interface CheckoutSummaryProps {
  subtotal: number
  selectedItemIds: string[]
}

export default function CheckoutSummary({ 
  subtotal, 
  selectedItemIds
}: CheckoutSummaryProps) {
  const [loading, setLoading] = useState(false)

  const total = subtotal

  return (
    <Card className="p-8 space-y-8 bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl sticky top-32">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold border-b border-white/5 pb-6">Payment Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-500 font-light italic">Subtotal</span>
          <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-500 font-light italic">Shipping</span>
          <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Free / Included</span>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-bold">Total Amount</span>
            <p className="text-2xl font-black tracking-tight text-white">
              Rp {total.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <CheckoutButton selectedItemIds={selectedItemIds} />
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-3 justify-center pt-4 border-t border-white/5">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Secure Payment via Midtrans</span>
      </div>
    </Card>
  )
}
