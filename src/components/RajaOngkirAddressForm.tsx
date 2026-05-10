'use client'

import { useState, useEffect, useRef } from 'react'
import { saveAddress } from '@/app/profile/address-actions'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-2xl" />
})

interface Province {
  province_id: string
  province: string
}

interface City {
  city_id: string
  city_name: string
  type: string
}

export default function RajaOngkirAddressForm({ onSuccess }: { onSuccess: () => void }) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  
  const [error, setError] = useState('')
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null)
  const [streetAddress, setStreetAddress] = useState('')

  // Search/Autocomplete State
  const [countrySearch, setCountrySearch] = useState('Indonesia')
  const [selectedCountry, setSelectedCountry] = useState('Indonesia')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  
  const [provinceSearch, setProvinceSearch] = useState('')
  const [citySearch, setCitySearch] = useState('')
  
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  
  const countryRef = useRef<HTMLDivElement>(null)
  const provinceRef = useRef<HTMLDivElement>(null)
  const cityRef = useRef<HTMLDivElement>(null)

  const countries = ['Indonesia']

  useEffect(() => {
    // Daftar Provinsi Indonesia (Fallback/Initial) agar tidak kosong jika API gagal
    const initialProvinces: Province[] = [
      { province_id: "1", province: "Bali" },
      { province_id: "2", province: "Bangka Belitung" },
      { province_id: "3", province: "Banten" },
      { province_id: "4", province: "Bengkulu" },
      { province_id: "5", province: "DI Yogyakarta" },
      { province_id: "6", province: "DKI Jakarta" },
      { province_id: "7", province: "Gorontalo" },
      { province_id: "8", province: "Jambi" },
      { province_id: "9", province: "Jawa Barat" },
      { province_id: "10", province: "Jawa Tengah" },
      { province_id: "11", province: "Jawa Timur" },
      { province_id: "12", province: "Kalimantan Barat" },
      { province_id: "13", province: "Kalimantan Selatan" },
      { province_id: "14", province: "Kalimantan Tengah" },
      { province_id: "15", province: "Kalimantan Timur" },
      { province_id: "16", province: "Kalimantan Utara" },
      { province_id: "17", province: "Kepulauan Riau" },
      { province_id: "18", province: "Lampung" },
      { province_id: "19", province: "Maluku" },
      { province_id: "20", province: "Maluku Utara" },
      { province_id: "21", province: "Nusa Tenggara Barat (NTB)" },
      { province_id: "22", province: "Nusa Tenggara Timur (NTT)" },
      { province_id: "23", province: "Papua" },
      { province_id: "24", province: "Papua Barat" },
      { province_id: "25", province: "Riau" },
      { province_id: "26", province: "Sulawesi Barat" },
      { province_id: "27", province: "Sulawesi Selatan" },
      { province_id: "28", province: "Sulawesi Tengah" },
      { province_id: "29", province: "Sulawesi Tenggara" },
      { province_id: "30", province: "Sulawesi Utara" },
      { province_id: "31", province: "Sumatera Barat" },
      { province_id: "32", province: "Sumatera Selatan" },
      { province_id: "33", province: "Sumatera Utara" },
      { province_id: "34", province: "Aceh" },
      { province_id: "35", province: "Papua Tengah" },
      { province_id: "36", province: "Papua Pegunungan" },
      { province_id: "37", province: "Papua Selatan" },
      { province_id: "38", province: "Papua Barat Daya" }
    ];
    setProvinces(initialProvinces);

    async function fetchProvinces() {
      try {
        const res = await fetch('/api/shipping/provinces')
        const data = await res.json()
        
        // Jika API sukses, gunakan data dari API (lebih update)
        if (Array.isArray(data) && data.length > 0) {
          setProvinces(data)
          return
        }
        
        // Jika API lapor error, catat di console tapi jangan hapus fallback
        if (data.error) {
          console.warn('RajaOngkir API failed, using manual fallback list. Error:', data.error)
        }
      } catch (err: any) {
        console.warn('Network error fetching provinces, using manual fallback. Message:', err.message)
      }
    }
    fetchProvinces()

    // Click outside listener
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setShowCountryDropdown(false)
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) setShowProvinceDropdown(false)
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!selectedProvince) {
      setCities([])
      return
    }

    async function fetchCities() {
      setLoadingCities(true)
      setError('') // Reset error
      try {
        const res = await fetch(`/api/shipping/cities?provinceId=${selectedProvince}`)
        const data = await res.json()
        if (data.error) {
          setError(`Gagal memuat kota: ${data.error}`)
          return
        }
        if (Array.isArray(data)) setCities(data)
      } catch (err) {
        console.error('Failed to fetch cities', err)
        setError('Koneksi ke layanan pengiriman terputus')
      } finally {
        setLoadingCities(false)
      }
    }
    fetchCities()
  }, [selectedProvince])

  const filteredProvinces = provinces.filter(p => 
    p.province.toLowerCase().includes(provinceSearch.toLowerCase())
  )

  const filteredCities = cities.filter(c => 
    c.city_name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.type.toLowerCase().includes(citySearch.toLowerCase())
  )

  const handleLocationSelect = async (lat: number, lng: number) => {
    setCoords({ lat, lng })
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      const data = await res.json()
      if (data.display_name) {
        setStreetAddress(data.display_name)
      }
    } catch (err) {
      console.error('Reverse geocoding failed', err)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // Only validate RajaOngkir selection if country is Indonesia
    if (selectedCountry === 'Indonesia' && (!selectedProvince || !selectedCity)) {
      setError('Silakan pilih Provinsi dan Kota dari daftar untuk pengiriman Indonesia')
      return
    } else if (selectedCountry !== 'Indonesia' && (!provinceSearch || !citySearch)) {
      setError('Silakan isi Provinsi dan Kota')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    let provinceName = provinceSearch
    let cityName = citySearch

    if (selectedCountry === 'Indonesia') {
      provinceName = provinces.find(p => p.province_id === selectedProvince)?.province || provinceSearch
      const cityObj = cities.find(c => c.city_id === selectedCity)
      cityName = cityObj ? `${cityObj.type} ${cityObj.city_name}` : citySearch
      
      formData.set('provinceId', selectedProvince)
      formData.set('cityId', selectedCity)
    }
    
    formData.set('country', selectedCountry)
    formData.set('province', provinceName)
    formData.set('city', cityName)

    if (coords) {
      formData.append('latitude', coords.lat.toString())
      formData.append('longitude', coords.lng.toString())
    }

    const result = await saveAddress(formData)
    
    if (result.success) {
      onSuccess()
    } else {
      setError(result.error || 'Gagal menyimpan alamat')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <MapPicker onLocationSelect={handleLocationSelect} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Label Alamat</label>
          <input name="label" placeholder="Rumah / Kantor" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none" required />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Nama Penerima</label>
          <input name="fullName" placeholder="Nama Lengkap" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Nomor Telepon</label>
        <input name="phone" placeholder="0812xxxx" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none" required />
      </div>

      {/* Searchable Country */}
      <div className="space-y-2 relative" ref={countryRef}>
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Negara (Country)</label>
        <input 
          type="text"
          placeholder="Cari Negara..."
          value={countrySearch}
          onChange={(e) => {
            setCountrySearch(e.target.value)
            setShowCountryDropdown(true)
          }}
          onFocus={() => setShowCountryDropdown(true)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none"
          required
        />
        {showCountryDropdown && (
          <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl">
            {countries.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase())).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setSelectedCountry(c)
                  setCountrySearch(c)
                  setShowCountryDropdown(false)
                }}
                className="w-full px-6 py-4 text-left text-sm hover:bg-secondary/10 hover:text-secondary transition-colors border-b border-white/5 last:border-0"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Searchable Province */}
        <div className="space-y-2 relative" ref={provinceRef}>
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Provinsi</label>
          <div className="relative group">
            <input 
              type="text"
              placeholder="Cari atau Pilih Provinsi..."
              value={provinceSearch}
              onChange={(e) => {
                setProvinceSearch(e.target.value)
                setShowProvinceDropdown(true)
              }}
              onFocus={() => setShowProvinceDropdown(true)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none pr-12"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-secondary transition-colors pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          {showProvinceDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl no-scrollbar">
              {filteredProvinces.length > 0 ? (
                filteredProvinces.map(p => (
                  <button
                    key={p.province_id}
                    type="button"
                    onClick={() => {
                      setSelectedProvince(p.province_id)
                      setProvinceSearch(p.province)
                      setShowProvinceDropdown(false)
                      setSelectedCity('')
                      setCitySearch('')
                    }}
                    className="w-full px-6 py-4 text-left text-sm hover:bg-secondary/10 hover:text-secondary transition-colors border-b border-white/5 last:border-0"
                  >
                    {p.province}
                  </button>
                ))
              ) : (
                <div className="px-6 py-4 text-xs text-zinc-500 italic">Provinsi tidak ditemukan...</div>
              )}
            </div>
          )}
        </div>

        {/* Searchable City */}
        <div className="space-y-2 relative" ref={cityRef}>
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Kota / Kabupaten</label>
          <div className="relative group">
            <input 
              type="text"
              placeholder={!selectedProvince ? 'Pilih Provinsi dulu' : 'Cari atau Pilih Kota...'}
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value)
                setShowCityDropdown(true)
              }}
              onFocus={() => selectedProvince && setShowCityDropdown(true)}
              disabled={!selectedProvince || loadingCities}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none disabled:opacity-50 pr-12"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-secondary transition-colors pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          {showCityDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl no-scrollbar">
              {filteredCities.length > 0 ? (
                filteredCities.map(c => (
                  <button
                    key={c.city_id}
                    type="button"
                    onClick={() => {
                      setSelectedCity(c.city_id)
                      setCitySearch(`${c.type} ${c.city_name}`)
                      setShowCityDropdown(false)
                    }}
                    className="w-full px-6 py-4 text-left text-sm hover:bg-secondary/10 hover:text-secondary transition-colors border-b border-white/5 last:border-0"
                  >
                    {c.type} {c.city_name}
                  </button>
                ))
              ) : (
                <div className="px-6 py-4 text-xs text-zinc-500 italic">Kota tidak ditemukan...</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Alamat Lengkap (Jalan, No Rumah, RT/RW)</label>
        <textarea 
          name="street" 
          rows={3} 
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none resize-none" 
          required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Kode Pos</label>
          <input name="postalCode" placeholder="xxxxx" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-secondary transition-all outline-none" required />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="isDefault" id="isDefault" className="h-5 w-5 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary" />
          <label htmlFor="isDefault" className="text-[10px] uppercase tracking-widest text-zinc-400 cursor-pointer font-bold">Set as Default Address</label>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs text-center font-medium bg-red-500/10 py-3 rounded-xl border border-red-500/20">{error}</p>}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full h-16 rounded-2xl bg-secondary text-white text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-2xl shadow-secondary/20"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving Address...
          </div>
        ) : 'Save Address'}
      </button>
    </form>
  )
}
