'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import RajaOngkirAddressForm from './RajaOngkirAddressForm'
import { deleteAddress } from '@/app/profile/address-actions'

interface Address {
  id: string
  label: string | null
  fullName: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

export default function AddressManagement({ initialAddresses }: { initialAddresses: Address[] }) {
  const [showForm, setShowForm] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus alamat ini?')) return
    setLoadingId(id)
    await deleteAddress(id)
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">Shipping Addresses</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary hover:text-secondary/80 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add New Address'}
        </button>
      </div>

      {showForm && (
        <Card className="border-secondary/20 bg-secondary/5">
          <RajaOngkirAddressForm onSuccess={() => setShowForm(false)} />
        </Card>
      )}

      <div className="grid gap-4">
        {initialAddresses.length === 0 ? (
          <p className="text-sm text-zinc-500 font-light italic text-center py-8">No addresses saved yet.</p>
        ) : (
          initialAddresses.map((addr) => (
            <Card key={addr.id} className={`group relative ${addr.isDefault ? 'border-secondary/30 bg-secondary/5' : ''}`} hover={false}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{addr.fullName}</span>
                    {addr.label && (
                      <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                        {addr.label}
                      </span>
                    )}
                    {addr.isDefault && (
                      <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-secondary text-white">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 font-light">{addr.phone}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                    {addr.street}<br />
                    {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleDelete(addr.id)}
                  disabled={loadingId === addr.id}
                  className="p-2 text-zinc-600 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
