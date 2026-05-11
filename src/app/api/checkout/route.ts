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

    // Selected items dari frontend
    const { selectedItemIds } = await request.json()

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

    // Filter items based on selection if provided
    const itemsToProcess = selectedItemIds && selectedItemIds.length > 0
      ? profile.cartItems.filter(item => selectedItemIds.includes(item.id))
      : profile.cartItems;

    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: 'No items selected for checkout' }, { status: 400 })
    }


    // Check stock availability
    for (const item of itemsToProcess) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({
          error: `Stock tidak cukup untuk ${item.product.name}. Tersedia: ${item.product.stock}`
        }, { status: 400 })
      }
    }

    // Calculate total
    const subtotal = itemsToProcess.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity, 0
    )
    const totalAmount = subtotal

    // Generate unique order ID for Midtrans
    const midtransOrderId = `SXG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    // Create order in database
    const order = await prisma.order.create({
      data: {
        profileId: profile.id,
        totalAmount: totalAmount,
        midtransOrderId: midtransOrderId,
        status: 'PENDING',
        orderItems: {
          create: itemsToProcess.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          }))
        }
      }
    })
    
    // Clear ONLY selected items from cart
    await prisma.cartItem.deleteMany({
      where: { 
        id: { in: itemsToProcess.map(item => item.id) }
      }
    })

    // Create Midtrans Snap transaction
    const transactionParams = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(totalAmount),
      },
      item_details: itemsToProcess.map(item => ({
        id: item.productId,
        price: Math.round(Number(item.product.price)),
        quantity: item.quantity,
        name: item.product.name.substring(0, 50), // Midtrans max 50 chars
      })),
      customer_details: {
        first_name: profile.fullName || 'Customer',
        email: profile.email || '',
        phone: '-',
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
