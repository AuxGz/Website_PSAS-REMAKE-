'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  initialPos?: [number, number]
}

function LocationMarker({ position, setPosition, onSelect }: any) {
  const map = useMap()

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      onSelect(lat, lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker position={position}></Marker>
  )
}

// Component to handle "Use Current Location" externally
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center, 16)
  return null
}

export default function MapPicker({ onLocationSelect, initialPos }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(initialPos || [-6.200000, 106.816666]) // Default Jakarta
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
          onLocationSelect(latitude, longitude)
        },
        (err) => {
          alert('Gagal mendapatkan lokasi: ' + err.message)
        }
      )
    }
  }

  if (!isClient) return <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-2xl" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Pilih Lokasi di Map</label>
        <button 
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Gunakan Lokasi Sekarang
        </button>
      </div>

      <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-white/5 relative z-0">
        <MapContainer 
          center={position || [-6.200000, 106.816666]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} onSelect={onLocationSelect} />
          {position && <ChangeView center={position} />}
        </MapContainer>
      </div>
      <p className="text-[9px] text-zinc-500 italic">Klik pada peta untuk menentukan titik pengiriman yang tepat.</p>
    </div>
  )
}
