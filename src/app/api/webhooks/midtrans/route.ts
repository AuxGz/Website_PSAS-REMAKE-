import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

// Midtrans will POST to this endpoint when payment status changes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body

    // Verify signature from Midtrans to prevent spoofing
    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex')

    if (signature_key !== expectedSignature) {
      console.error('Invalid Midtrans signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { midtransOrderId: order_id },
      include: { orderItems: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Determine new status based on Midtrans transaction_status
    let newStatus: 'PENDING' | 'PAID' | 'CANCELLED' = 'PENDING'

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        newStatus = 'PAID'
      }
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      newStatus = 'CANCELLED'
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        paymentMethod: payment_type || null,
        paidAt: newStatus === 'PAID' ? new Date() : null,
      }
    })

    // If PAID → reduce stock & clear cart
    if (newStatus === 'PAID') {
      // Reduce stock for each product
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        })
      }

      // Clear the user's cart
      await prisma.cartItem.deleteMany({
        where: { profileId: order.profileId }
      })
    }

    // If CANCELLED → we could restore stock if needed (already deducted)
    // For now, stock is only deducted on PAID

    return NextResponse.json({ status: 'ok' })

  } catch (error: any) {
    console.error('Midtrans webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
