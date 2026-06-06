import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    const addresses = await prisma.shippingAddress.findMany({
      where: { profileId: profile.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return Response.json({ addresses })
  } catch (error: any) {
    console.error('Failed to fetch shipping addresses:', error)
    return Response.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      label,
      recipientName,
      phone,
      fullAddress,
      cityId,
      cityName,
      province,
      postalCode,
      latitude,
      longitude,
      isDefault,
    } = body

    // Validate required fields
    if (!recipientName || !phone || !fullAddress || !cityId || !cityName || !province) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults first
    if (isDefault) {
      await prisma.shippingAddress.updateMany({
        where: { profileId: profile.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    // Check if this is the first address — auto-set as default
    const existingCount = await prisma.shippingAddress.count({
      where: { profileId: profile.id },
    })

    const address = await prisma.shippingAddress.create({
      data: {
        profileId: profile.id,
        label: label || null,
        recipientName,
        phone,
        fullAddress,
        cityId: String(cityId),
        cityName,
        province,
        postalCode: postalCode || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        isDefault: isDefault || existingCount === 0, // First address is always default
      },
    })

    return Response.json({ address }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create shipping address:', error)
    return Response.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { searchParams } = request.nextUrl
    const addressId = searchParams.get('id')

    if (!addressId) {
      return Response.json({ error: 'Address ID is required' }, { status: 400 })
    }

    // Verify ownership
    const address = await prisma.shippingAddress.findFirst({
      where: { id: addressId, profileId: profile.id },
    })

    if (!address) {
      return Response.json({ error: 'Address not found' }, { status: 404 })
    }

    await prisma.shippingAddress.delete({
      where: { id: addressId },
    })

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const nextDefault = await prisma.shippingAddress.findFirst({
        where: { profileId: profile.id },
        orderBy: { createdAt: 'desc' },
      })

      if (nextDefault) {
        await prisma.shippingAddress.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        })
      }
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete shipping address:', error)
    return Response.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
