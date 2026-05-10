import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get('provinceId')
    
    const apiKey = process.env.RAJAONGKIR_API_KEY
    const baseUrl = process.env.RAJAONGKIR_BASE_URL

    if (!apiKey || !baseUrl) {
      return NextResponse.json({ error: 'RajaOngkir configuration missing' }, { status: 500 })
    }

    const url = provinceId 
      ? `${baseUrl}/city?province=${provinceId}`
      : `${baseUrl}/city`

    const response = await fetch(url, {
      headers: { key: apiKey }
    })

    const data = await response.json()

    if (data.rajaongkir.status.code !== 200) {
      return NextResponse.json({ error: data.rajaongkir.status.description }, { status: 400 })
    }

    return NextResponse.json(data.rajaongkir.results)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
