import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.RAJAONGKIR_API_KEY
    const baseUrl = process.env.RAJAONGKIR_BASE_URL

    if (!apiKey || !baseUrl) {
      return NextResponse.json({ error: 'RajaOngkir configuration missing' }, { status: 500 })
    }

    const response = await fetch(`${baseUrl}/province`, {
      headers: { 'key': apiKey }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `RajaOngkir Response Error: ${response.status} - ${errorText}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data.rajaongkir.results)
  } catch (error: any) {
    console.error('PROVINCE_API_ERROR:', error)
    return NextResponse.json({ 
      error: `Fetch Failed: ${error.message}`,
      details: error.cause ? String(error.cause) : 'No extra details'
    }, { status: 500 })
  }
}
