import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { destination, weight, courier } = await request.json()
    
    const apiKey = process.env.RAJAONGKIR_API_KEY
    const baseUrl = process.env.RAJAONGKIR_BASE_URL
    const origin = process.env.RAJAONGKIR_ORIGIN_CITY_ID

    if (!apiKey || !origin || !baseUrl) {
      return NextResponse.json({ error: 'RajaOngkir configuration missing' }, { status: 500 })
    }

    const response = await fetch(`${baseUrl}/cost`, {
      method: 'POST',
      headers: { 
        'key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        origin: origin,
        destination: destination,
        weight: weight.toString(),
        courier: courier || 'jne'
      })
    })

    const data = await response.json()

    if (data.rajaongkir.status.code !== 200) {
      return NextResponse.json({ error: data.rajaongkir.status.description }, { status: 400 })
    }

    return NextResponse.json(data.rajaongkir.results[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
