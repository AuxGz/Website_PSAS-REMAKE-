'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import CheckoutButton from '@/components/CheckoutButton'

interface CheckoutSummaryProps {
  subtotal: number
  totalWeight: number
  selectedAddressId: string
  selectedCityId: string | null
  selectedSubdistrictId: string | null
}

export default function CheckoutSummary({ 
  subtotal, 
  totalWeight, 
  selectedAddressId,
  selectedCityId,
  selectedSubdistrictId
}: CheckoutSummaryProps) {
  const [shippingCost, setShippingCost] = useState(0)
  const [loading, setLoading] = useState(false)
  const [courier, setCourier] = useState('jne')
  const [services, setServices] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<string>('')

  useEffect(() => {
    // If we have a subdistrict ID, use it for destination (v2 Pro requirement)
    const destination = selectedSubdistrictId || selectedCityId
    
    if (!destination || !totalWeight) return

    async function fetchShippingCost() {
      setLoading(true)
      try {
        const res = await fetch('/api/shipping/cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: destination,
            weight: totalWeight,
            courier: courier
          })
        })
        const data = await res.json()
        if (data.costs) {
          setServices(data.costs)
          // Default select first service
          if (data.costs.length > 0) {
            setSelectedService(data.costs[0].service)
            setShippingCost(data.costs[0].cost[0].value)
          }
        }
      } catch (err) {
        console.error('Failed to fetch shipping cost', err)
      } finally {
        setLoading(false)
      }
    }

    fetchShippingCost()
  }, [selectedSubdistrictId, selectedCityId, totalWeight, courier])

  const handleServiceChange = (serviceName: string) => {
    const service = services.find(s => s.service === serviceName)
    if (service) {
      setSelectedService(serviceName)
      setShippingCost(service.cost[0].value)
    }
  }

  const total = subtotal + shippingCost

  return (
    <Card className="sticky top-32 space-y-8" hover={false}>
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold border-b border-white/5 pb-6">Payment Summary</h3>

      <div className="space-y-6">
        {/* Courier Selection */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500">Pilih Kurir</label>
          <div className="flex gap-2">
            {['jne', 'pos', 'tiki'].map(c => (
              <button
                key={c}
                onClick={() => setCourier(c)}
                className={`flex-1 py-2 rounded-xl border text-[10px] uppercase font-bold transition-all ${
                  courier === c ? 'border-secondary bg-secondary/10 text-secondary' : 'border-white/5 bg-white/5 text-zinc-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Service Selection */}
        {services.length > 0 && (
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500">Layanan</label>
            <select
              value={selectedService}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-secondary transition-all outline-none appearance-none"
            >
              {services.map(s => (
                <option key={s.service} value={s.service} className="bg-background">
                  {s.service} - {s.description} (Rp {s.cost[0].value.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-500 font-light">Subtotal</span>
            <span className="text-sm font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-500 font-light">Shipping ({courier.toUpperCase()} {selectedService})</span>
            <span className="text-sm font-medium">
              {loading ? 'Calculating...' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
            </span>
          </div>
          <div className="pt-6 border-t border-white/5 flex justify-between items-end">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400">Total</span>
            <span className="text-3xl font-light italic">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <CheckoutButton
        addressId={selectedAddressId}
        disabled={!selectedAddressId || loading || !selectedService}
        shippingCost={shippingCost}
      />

      <div className="flex items-center justify-center gap-2 pt-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <p className="text-[9px] text-zinc-600 tracking-wider">Secure payment powered by Midtrans</p>
      </div>
    </Card>
  )
}
