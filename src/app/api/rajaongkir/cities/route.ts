import { type NextRequest } from 'next/server'

const RAJAONGKIR_BASE = 'https://api.rajaongkir.com/starter'

// Use globalThis to persist cache across Next.js dev mode module re-evaluations
const globalCache = globalThis as typeof globalThis & {
  __rajaongkir_cities_cache?: any[] | null
  __rajaongkir_cities_timestamp?: number
  __rajaongkir_cities_isFallback?: boolean
  __rajaongkir_cities_pending?: Promise<any[]> | null
}

const CACHE_TTL = 1000 * 60 * 60 // 1 hour for real data
const FALLBACK_CACHE_TTL = 1000 * 60 * 5 // 5 minutes for fallback (retry sooner)

// Fallback Mock Cities to prevent checkout from breaking
const MOCK_CITIES = [
  { city_id: '54', city_name: 'Banyumas', province: 'Jawa Tengah', type: 'Kabupaten', postal_code: '53141' },
  { city_id: '152', city_name: 'Jakarta Pusat', province: 'DKI Jakarta', type: 'Kota', postal_code: '10540' },
  { city_id: '153', city_name: 'Jakarta Selatan', province: 'DKI Jakarta', type: 'Kota', postal_code: '12230' },
  { city_id: '154', city_name: 'Jakarta Timur', province: 'DKI Jakarta', type: 'Kota', postal_code: '13330' },
  { city_id: '155', city_name: 'Jakarta Utara', province: 'DKI Jakarta', type: 'Kota', postal_code: '14140' },
  { city_id: '156', city_name: 'Jakarta Barat', province: 'DKI Jakarta', type: 'Kota', postal_code: '11220' },
  { city_id: '78', city_name: 'Bogor', province: 'Jawa Barat', type: 'Kota', postal_code: '16119' },
  { city_id: '42', city_name: 'Bandung', province: 'Jawa Barat', type: 'Kota', postal_code: '40111' },
  { city_id: '399', city_name: 'Semarang', province: 'Jawa Tengah', type: 'Kota', postal_code: '50131' },
  { city_id: '444', city_name: 'Surabaya', province: 'Jawa Timur', type: 'Kota', postal_code: '60119' },
  { city_id: '501', city_name: 'Yogyakarta', province: 'DI Yogyakarta', type: 'Kota', postal_code: '55111' },
  { city_id: '114', city_name: 'Denpasar', province: 'Bali', type: 'Kota', postal_code: '80111' },
  { city_id: '254', city_name: 'Malang', province: 'Jawa Timur', type: 'Kota', postal_code: '65119' },
  { city_id: '340', city_name: 'Medan', province: 'Sumatera Utara', type: 'Kota', postal_code: '20228' },
  { city_id: '278', city_name: 'Makassar', province: 'Sulawesi Selatan', type: 'Kota', postal_code: '90111' },
  { city_id: '350', city_name: 'Purwokerto', province: 'Jawa Tengah', type: 'Kabupaten', postal_code: '53114' },
  { city_id: '409', city_name: 'Solo', province: 'Jawa Tengah', type: 'Kota', postal_code: '57113' },
  { city_id: '457', city_name: 'Tangerang', province: 'Banten', type: 'Kota', postal_code: '15111' },
  { city_id: '79', city_name: 'Bekasi', province: 'Jawa Barat', type: 'Kota', postal_code: '17121' },
  { city_id: '115', city_name: 'Depok', province: 'Jawa Barat', type: 'Kota', postal_code: '16411' },
]

// Internal fetch (not deduplicated)
async function _doFetchCities(): Promise<any[]> {
  const now = Date.now()

  const apiKey = process.env.RAJAONGKIR_API_KEY
  if (!apiKey) {
    console.warn('RAJAONGKIR_API_KEY is not configured. Using fallback cities.')
    globalCache.__rajaongkir_cities_cache = MOCK_CITIES
    globalCache.__rajaongkir_cities_timestamp = now
    globalCache.__rajaongkir_cities_isFallback = true
    return MOCK_CITIES
  }

  try {
    const response = await fetch(`${RAJAONGKIR_BASE}/city`, {
      headers: { key: apiKey },
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      throw new Error(`RajaOngkir API error: ${response.status}`)
    }

    const data = await response.json()
    const cities = data.rajaongkir?.results || []

    // Cache the real result
    globalCache.__rajaongkir_cities_cache = cities
    globalCache.__rajaongkir_cities_timestamp = now
    globalCache.__rajaongkir_cities_isFallback = false

    return cities
  } catch (error) {
    console.warn('RajaOngkir API failed or timed out. Using fallback mock cities.', error)
    
    // Cache the fallback so we don't re-timeout on every keystroke
    globalCache.__rajaongkir_cities_cache = MOCK_CITIES
    globalCache.__rajaongkir_cities_timestamp = now
    globalCache.__rajaongkir_cities_isFallback = true
    return MOCK_CITIES
  }
}

// Public fetch with cache + promise deduplication
async function fetchCities(): Promise<any[]> {
  const now = Date.now()
  const ttl = globalCache.__rajaongkir_cities_isFallback ? FALLBACK_CACHE_TTL : CACHE_TTL

  // Return from cache if valid
  if (globalCache.__rajaongkir_cities_cache && now - (globalCache.__rajaongkir_cities_timestamp || 0) < ttl) {
    return globalCache.__rajaongkir_cities_cache
  }

  // If a fetch is already in-flight, share it instead of starting another
  if (globalCache.__rajaongkir_cities_pending) {
    return globalCache.__rajaongkir_cities_pending
  }

  // Start a single fetch and store the promise
  globalCache.__rajaongkir_cities_pending = _doFetchCities().finally(() => {
    globalCache.__rajaongkir_cities_pending = null
  })

  return globalCache.__rajaongkir_cities_pending
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')?.toLowerCase() || ''

    const cities = await fetchCities()

    // Filter if search query provided
    const filtered = search
      ? cities.filter(
          (city: any) =>
            city.city_name.toLowerCase().includes(search) ||
            city.province.toLowerCase().includes(search)
        )
      : cities

    return Response.json({ cities: filtered })
  } catch (error: any) {
    console.error('Failed to fetch cities:', error.message)
    return Response.json(
      { error: error.message || 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}
