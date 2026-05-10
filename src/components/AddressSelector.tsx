'use client'

import { useState } from 'react'

interface Address {
  id: string
  label: string | null
  fullName: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
}

interface AddressSelectorProps {
  addresses: Address[]
  defaultAddressId?: string
  onSelect: (address: Address) => void
}

export default function AddressSelector({ addresses, defaultAddressId, onSelect }: AddressSelectorProps) {
  const [selectedId, setSelectedId] = useState(defaultAddressId || addresses[0]?.id)

  const handleSelect = (address: Address) => {
    setSelectedId(address.id)
    onSelect(address)
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <label 
          key={address.id}
          className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
            selectedId === address.id 
              ? 'border-secondary bg-secondary/5' 
              : 'border-white/10 hover:border-white/20 bg-primary/20'
          }`}
        >
          <div className="flex items-center h-5">
            <input
              type="radio"
              name="address"
              className="h-4 w-4 rounded-full border-white/20 bg-background text-secondary focus:ring-secondary focus:ring-offset-background transition-all"
              checked={selectedId === address.id}
              onChange={() => handleSelect(address)}
            />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{address.fullName}</span>
              {address.label && (
                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/5 text-zinc-400">
                  {address.label}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-500 font-light">{address.phone}</p>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              {address.street}<br />
              {address.city}, {address.province} {address.postalCode}
            </p>
          </div>
        </label>
      ))}
    </div>
  )
}
