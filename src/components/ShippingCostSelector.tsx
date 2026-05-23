'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'

interface ShippingService {
  service: string
  description: string
  cost: Array<{
    value: number
    etd: string
    note: string
  }>
}

interface ShippingCostSelectorProps {
  destinationCityId: string | null
  totalWeightGrams: number
  onSelect: (cost: number, service: string) => void
  selectedService: string | null
}

const ORIGIN_CITY_ID = '54' // Banyumas
const COURIER = 'jne' // Free tier only supports JNE

export default function ShippingCostSelector({
  destinationCityId,
  totalWeightGrams,
  onSelect,
  selectedService,
}: ShippingCostSelectorProps) {
  const [services, setServices] = useState<ShippingService[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!destinationCityId) {
      setServices([])
      return
    }

    const fetchCosts = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/rajaongkir/cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: ORIGIN_CITY_ID,
            destination: destinationCityId,
            weight: totalWeightGrams,
            courier: COURIER,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Gagal menghitung ongkos kirim')
          return
        }

        const courierResults = data.results[0]?.costs || []
        setServices(courierResults)
        
        // Auto-select first service if none selected
        if (courierResults.length > 0 && !selectedService) {
          const first = courierResults[0]
          onSelect(first.cost[0].value, `${COURIER.toUpperCase()} ${first.service}`)
        }
      } catch (err: any) {
        setError('Terjadi kesalahan saat menghitung ongkos kirim')
      } finally {
        setLoading(false)
      }
    }

    fetchCosts()
  }, [destinationCityId, totalWeightGrams]) // Removed onSelect and selectedService to prevent infinite loops

  if (!destinationCityId) {
    return null
  }

  return (
    <Card className="space-y-6" hover={false}>
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold border-b border-white/5 pb-6">
        Metode Pengiriman (JNE)
      </h3>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <svg className="animate-spin h-6 w-6 text-secondary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs text-zinc-500 font-light animate-pulse">Menghitung ongkos kirim terbaik...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
          {error}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-zinc-500 font-light">Layanan pengiriman tidak tersedia untuk rute ini.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {services.map((service) => {
            const serviceName = `${COURIER.toUpperCase()} ${service.service}`
            const cost = service.cost[0]
            const isSelected = selectedService === serviceName

            return (
              <div
                key={service.service}
                onClick={() => onSelect(cost.value, serviceName)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
                  isSelected
                    ? 'border-secondary bg-secondary/10'
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{serviceName}</span>
                    <span className="text-[10px] text-zinc-400 font-light">({service.description})</span>
                  </div>
                  <p className="text-xs text-zinc-500 font-light">
                    Estimasi tiba: {cost.etd.replace('HARI', '').replace('hari', '')} Hari
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-sm text-white">
                    Rp {cost.value.toLocaleString('id-ID')}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'border-secondary bg-secondary' : 'border-white/20'
                  }`}>
                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
