import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import snap from '@/lib/midtrans'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { addressId, shippingCost: providedShippingCost } = await request.json()

    if (!addressId) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const shippingCost = Number(providedShippingCost) || 0

    // Get profile with cart items
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: { product: true }
        }
      }
    })

    if (!profile || profile.cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Validate address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, profileId: profile.id }
    })

    if (!address) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    // Check stock availability
    for (const item of profile.cartItems) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({
          error: `Stock tidak cukup untuk ${item.product.name}. Tersedia: ${item.product.stock}`
        }, { status: 400 })
      }
    }

    // Calculate total
    const subtotal = profile.cartItems.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity, 0
    )
    const totalAmount = subtotal + shippingCost

    // Generate unique order ID for Midtrans
    const midtransOrderId = `SXG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    // Create order in database
    const order = await prisma.order.create({
      data: {
        profileId: profile.id,
        addressId: addressId,
        totalAmount: totalAmount,
        shippingCost: shippingCost,
        midtransOrderId: midtransOrderId,
        status: 'PENDING',
        orderItems: {
          create: profile.cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          }))
        }
      }
    })

    // Create Midtrans Snap transaction
    const transactionParams = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(totalAmount),
      },
      item_details: profile.cartItems.map(item => ({
        id: item.productId,
        price: Math.round(Number(item.product.price)),
        quantity: item.quantity,
        name: item.product.name.substring(0, 50), // Midtrans max 50 chars
      })),
      customer_details: {
        first_name: profile.fullName || 'Customer',
        email: profile.email || '',
        phone: address.phone,
        shipping_address: {
          first_name: address.fullName,
          phone: address.phone,
          address: address.street,
          city: address.city,
          postal_code: address.postalCode,
        }
      }
    }

    const snapTransaction = await snap.createTransaction(transactionParams)

    // Save snap token to order
    await prisma.order.update({
      where: { id: order.id },
      data: { midtransToken: snapTransaction.token }
    })

    return NextResponse.json({
      token: snapTransaction.token,
      redirectUrl: snapTransaction.redirect_url,
      orderId: order.id,
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    )
  }
}
