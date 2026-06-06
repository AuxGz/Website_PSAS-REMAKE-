'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import ShippingAddressForm from './ShippingAddressForm'

interface ShippingAddress {
  id: string
  label: string | null
  recipientName: string
  phone: string
  fullAddress: string
  cityName: string
  province: string
  postalCode: string | null
  isDefault: boolean
  cityId: string
}

interface ShippingAddressSelectorProps {
  addresses: ShippingAddress[]
  selectedAddressId: string | null
  onSelect: (addressId: string, cityId: string) => void
  onAddressAdded: (newAddress: ShippingAddress) => void
}

export default function ShippingAddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onAddressAdded,
}: ShippingAddressSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  // Automatically select the default address if none is selected and there are addresses available
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault) || addresses[0]
      onSelect(defaultAddress.id, defaultAddress.cityId)
    }
  }, [selectedAddressId, addresses, onSelect])

  const handleSaveAddress = (newAddress: ShippingAddress) => {
    onAddressAdded(newAddress)
    onSelect(newAddress.id, newAddress.cityId)
    setShowAddForm(false)
  }

  return (
    <Card className="space-y-6" hover={false}>
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">
          Alamat Pengiriman
        </h3>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary hover:text-white transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Tambah Alamat
          </button>
        )}
      </div>

      {showAddForm ? (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <ShippingAddressForm
            onSave={handleSaveAddress}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-zinc-500 font-light mb-4">Anda belum memiliki alamat pengiriman tersimpan.</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="h-12 px-8 rounded-xl bg-secondary text-white text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-secondary/90 transition-all duration-300"
          >
            Tambah Alamat Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelect(address.id, address.cityId)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                selectedAddressId === address.id
                  ? 'border-secondary bg-secondary/10'
                  : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{address.recipientName}</span>
                  {address.label && (
                    <span className="text-[9px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded text-zinc-300">
                      {address.label}
                    </span>
                  )}
                  {address.isDefault && (
                    <span className="text-[9px] uppercase tracking-wider bg-secondary/20 text-secondary px-2 py-1 rounded">
                      Utama
                    </span>
                  )}
                </div>
                {selectedAddressId === address.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary"><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-light leading-relaxed mb-1">
                {address.phone}
              </p>
              <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                {address.fullAddress}
              </p>
              <p className="text-xs text-zinc-400 font-light leading-relaxed mt-1">
                {address.cityName}, {address.province} {address.postalCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
