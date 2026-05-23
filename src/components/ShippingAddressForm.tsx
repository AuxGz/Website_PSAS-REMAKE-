'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Lazy-load MapPicker (uses Leaflet which needs window)
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false })

interface City {
  city_id: string
  city_name: string
  province: string
  type: string
  postal_code: string
}

interface ShippingAddressFormProps {
  onSave: (address: any) => void
  onCancel: () => void
}

export default function ShippingAddressForm({ onSave, onCancel }: ShippingAddressFormProps) {
  const [label, setLabel] = useState('Rumah')
  const [recipientName, setRecipientName] = useState('')
  const [phone, setPhone] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  // City search
  const [citySearch, setCitySearch] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showMap, setShowMap] = useState(false)

  // Search cities with debounce
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCities([])
      return
    }

    setLoadingCities(true)
    try {
      const res = await fetch(`/api/rajaongkir/cities?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      setCities(data.cities || [])
    } catch {
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchCities(citySearch)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [citySearch, searchCities])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectCity = (city: City) => {
    setSelectedCity(city)
    setCitySearch(`${city.type} ${city.city_name}, ${city.province}`)
    setPostalCode(city.postal_code || '')
    setShowCityDropdown(false)
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCity) {
      setError('Silakan pilih kota tujuan')
      return
    }
    if (!recipientName.trim()) {
      setError('Nama penerima wajib diisi')
      return
    }
    if (!phone.trim()) {
      setError('Nomor telepon wajib diisi')
      return
    }
    if (!fullAddress.trim()) {
      setError('Alamat lengkap wajib diisi')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/shipping-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label,
          recipientName: recipientName.trim(),
          phone: phone.trim(),
          fullAddress: fullAddress.trim(),
          cityId: selectedCity.city_id,
          cityName: `${selectedCity.type} ${selectedCity.city_name}`,
          province: selectedCity.province,
          postalCode: postalCode || selectedCity.postal_code,
          latitude,
          longitude,
          isDefault: false,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan alamat')
        return
      }

      onSave(data.address)
    } catch {
      setError('Terjadi kesalahan saat menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const labelOptions = ['Rumah', 'Kantor', 'Lainnya']

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Label Selector */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Label Alamat
        </label>
        <div className="flex gap-2">
          {labelOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setLabel(opt)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                label === opt
                  ? 'bg-secondary/20 border-secondary/50 text-secondary'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Recipient Name */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Nama Penerima *
        </label>
        <input
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Masukkan nama penerima"
          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Nomor Telepon *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all"
        />
      </div>

      {/* City Search */}
      <div className="space-y-2 relative" ref={cityDropdownRef}>
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Kota / Kabupaten *
        </label>
        <div className="relative">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value)
              setSelectedCity(null)
              setShowCityDropdown(true)
            }}
            onFocus={() => {
              if (citySearch.length >= 2) setShowCityDropdown(true)
            }}
            placeholder="Ketik nama kota... (min. 2 huruf)"
            className="w-full h-12 px-4 pr-10 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all"
          />
          {loadingCities && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-4 w-4 text-secondary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          {selectedCity && !loadingCities && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          )}
        </div>

        {/* City Dropdown */}
        {showCityDropdown && cities.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl bg-primary/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
            {cities.map((city) => (
              <button
                key={city.city_id}
                type="button"
                onClick={() => handleSelectCity(city)}
                className="w-full px-4 py-3 text-left hover:bg-secondary/10 transition-colors border-b border-white/5 last:border-0"
              >
                <span className="text-sm font-medium text-foreground">
                  {city.type} {city.city_name}
                </span>
                <span className="text-xs text-zinc-500 ml-2">
                  {city.province}
                </span>
              </button>
            ))}
          </div>
        )}
        {showCityDropdown && citySearch.length >= 2 && !loadingCities && cities.length === 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl bg-primary/95 backdrop-blur-xl border border-white/10 p-4 text-center">
            <span className="text-xs text-zinc-500">Kota tidak ditemukan</span>
          </div>
        )}
      </div>

      {/* Postal Code */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Kode Pos
        </label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Kode pos"
          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all"
        />
      </div>

      {/* Full Address */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Alamat Lengkap *
        </label>
        <textarea
          value={fullAddress}
          onChange={(e) => setFullAddress(e.target.value)}
          placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all resize-none"
        />
      </div>

      {/* Map Toggle */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {showMap ? 'Sembunyikan Peta' : 'Tandai Lokasi di Peta'} (opsional)
        </button>

        {showMap && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <MapPicker
              onLocationSelect={handleLocationSelect}
              initialPos={latitude && longitude ? [latitude, longitude] : undefined}
            />
            {latitude && longitude && (
              <p className="text-[9px] text-secondary mt-2 font-mono">
                📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs font-medium animate-in fade-in duration-300">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl border border-white/10 text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400 hover:bg-white/5 transition-all duration-300"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 h-12 rounded-xl bg-secondary text-white text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            'Simpan Alamat'
          )}
        </button>
      </div>
    </form>
  )
}
