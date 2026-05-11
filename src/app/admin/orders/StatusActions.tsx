'use client'

import { updateOrderStatus, syncWithMidtrans } from './actions'
import { useState } from 'react'

interface StatusActionsProps {
  orderId: string
  currentStatus: string
  midtransOrderId: string
}

export default function StatusActions({ orderId, currentStatus, midtransOrderId }: StatusActionsProps) {
  const [syncing, setSyncing] = useState(false)

  const handleCancel = async (e: React.FormEvent) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      e.preventDefault()
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    const result = await syncWithMidtrans(orderId, midtransOrderId)
    if (result.success) {
      alert(`Status synced! New status: ${result.status}`)
    } else {
      alert(result.error || 'Failed to sync. Transaction might still be pending in Midtrans.')
    }
    setSyncing(false)
  }

  if (currentStatus === 'CANCELLED') return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-bold border border-white/5 px-4 py-2 rounded-xl">
        No Actions Available
      </span>
    </div>
  )

  return (
    <div className="flex items-center gap-2">
      <form action={updateOrderStatus} className="flex items-center gap-2">
        <input type="hidden" name="orderId" value={orderId} />
        <select 
          name="status" 
          defaultValue={currentStatus}
          className="bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none"
        >
          {/* Tampilkan status saat ini jika bukan salah satu dari opsi utama */}
          {currentStatus === 'PAID' && <option value="PAID">Paid</option>}
          {currentStatus === 'PENDING' && <option value="PENDING">Pending</option>}
          
          <option value="PROCESSING">Processing</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button 
          type="submit" 
          className="px-4 py-2 bg-secondary/80 hover:bg-secondary rounded-xl text-[10px] uppercase font-bold transition-colors text-white"
        >
          Update
        </button>
      </form>
      
      <button 
        onClick={handleSync}
        disabled={syncing}
        className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl text-[10px] uppercase font-bold transition-all disabled:opacity-50"
      >
        {syncing ? 'Syncing...' : 'Sync Status'}
      </button>

      <form action={updateOrderStatus} onSubmit={handleCancel}>
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="status" value="CANCELLED" />
        <button 
          type="submit" 
          className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] uppercase font-bold transition-all"
        >
          Cancel
        </button>
      </form>
    </div>
  )
}
