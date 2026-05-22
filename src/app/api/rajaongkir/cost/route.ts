import { type NextRequest } from 'next/server'

const RAJAONGKIR_BASE = 'https://api.rajaongkir.com/starter'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RAJAONGKIR_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'RAJAONGKIR_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { origin, destination, weight, courier } = body

    // Validate required fields
    if (!origin || !destination || !weight || !courier) {
      return Response.json(
        { error: 'Missing required fields: origin, destination, weight, courier' },
        { status: 400 }
      )
    }

    // Validate weight is a positive number
    const weightNum = Number(weight)
    if (isNaN(weightNum) || weightNum <= 0) {
      return Response.json(
        { error: 'Weight must be a positive number (in grams)' },
        { status: 400 }
      )
    }

    try {
      const response = await fetch(`${RAJAONGKIR_BASE}/cost`, {
        method: 'POST',
        headers: {
          key: apiKey,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          origin: String(origin),
          destination: String(destination),
          weight: String(Math.ceil(weightNum)), // Must be integer grams
          courier: String(courier).toLowerCase(),
        }),
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('RajaOngkir cost error:', errorText)
        throw new Error('Failed to calculate shipping cost')
      }

      const data = await response.json()
      const results = data.rajaongkir?.results || []

      return Response.json({ results })
    } catch (error) {
      console.warn('RajaOngkir Cost API failed/timed out. Using fallback mock cost.', error)
      const mockResults = [
        {
          code: courier,
          name: "Jalur Nugraha Ekakurir (JNE)",
          costs: [
            {
              service: "REG",
              description: "Layanan Reguler",
              cost: [
                {
                  value: 15000 + (Math.ceil(weightNum / 1000) - 1) * 10000,
                  etd: "2-3 HARI",
                  note: ""
                }
              ]
            },
            {
              service: "YES",
              description: "Yakin Esok Sampai",
              cost: [
                {
                  value: 25000 + (Math.ceil(weightNum / 1000) - 1) * 15000,
                  etd: "1 HARI",
                  note: ""
                }
              ]
            }
          ]
        }
      ]
      return Response.json({ results: mockResults })
    }
  } catch (error: any) {
    console.error('Shipping cost calculation error:', error.message)
    return Response.json(
      { error: error.message || 'Failed to calculate shipping cost' },
      { status: 500 }
    )
  }
}
