'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import AddressSelector from '@/components/AddressSelector'
import CheckoutSummary from '@/components/CheckoutSummary'

interface Address {
  id: string
  label: string | null
  fullName: string
  phone: string
  street: string
  city: string
  cityId: string | null
  subdistrict: string | null
  subdistrictId: string | null
  province: string
  provinceId: string | null
  postalCode: string
}

interface ProductImage {
  url: string
}

interface Product {
  name: string
  price: any
  images: ProductImage[]
}

interface CartItem {
  id: string
  quantity: number
  product: Product
}

interface CheckoutClientProps {
  initialAddresses: Address[]
  cartItems: CartItem[]
  subtotal: number
  totalWeight: number
}

export default function CheckoutClient({ 
  initialAddresses, 
  cartItems, 
  subtotal, 
  totalWeight 
}: CheckoutClientProps) {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    initialAddresses.find(a => (a as any).isDefault) || initialAddresses[0] || null
  )

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Left — Address & Items */}
      <div className="lg:col-span-2 space-y-8">
        {/* Shipping Address */}
        <Card className="space-y-6" hover={false}>
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold border-b border-white/5 pb-6">Shipping Address</h3>

          {initialAddresses.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-zinc-500 font-light italic">Belum ada alamat pengiriman.</p>
              <a href="/profile" className="inline-block text-[10px] tracking-[0.2em] uppercase font-bold border border-secondary/30 px-6 py-3 rounded-xl text-secondary hover:bg-secondary hover:text-white transition-all">
                Tambah Alamat di Profil
              </a>
            </div>
          ) : (
            <AddressSelector 
              addresses={initialAddresses as any} 
              defaultAddressId={selectedAddress?.id} 
              onSelect={(addr) => setSelectedAddress(addr as any)}
            />
          )}
        </Card>

        {/* Order Items */}
        <Card className="space-y-6" hover={false}>
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold border-b border-white/5 pb-6">Order Items ({cartItems.length})</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
                <div className="h-16 w-16 rounded-xl bg-primary/30 border border-white/5 overflow-hidden flex-shrink-0">
                  {item.product.images[0] ? (
                    <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-zinc-500 font-light">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium text-sm whitespace-nowrap">
                  Rp {(Number(item.product.price) * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right — Payment Summary */}
      <div className="lg:col-span-1">
        <CheckoutSummary
          subtotal={subtotal}
          totalWeight={totalWeight}
          selectedAddressId={selectedAddress?.id || ''}
          selectedCityId={selectedAddress?.cityId || null}
          selectedSubdistrictId={selectedAddress?.subdistrictId || null}
        />
      </div>
    </div>
  )
}
