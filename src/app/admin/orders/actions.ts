'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import snap from '@/lib/midtrans'

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get('orderId') as string
  const status = formData.get('status') as any
  
  // Ambil data pesanan lama untuk cek apakah perlu refund
  const oldOrder = await prisma.order.findUnique({
    where: { id: orderId }
  })

  // Jika status berubah ke CANCELLED dan sebelumnya sudah PAID, coba refund
  if (status === 'CANCELLED' && oldOrder?.status === 'PAID' && oldOrder.midtransOrderId) {
    try {
      console.log('Attempting auto-refund for order:', oldOrder.midtransOrderId)
      await snap.transaction.refund(oldOrder.midtransOrderId, {
        amount: Number(oldOrder.totalAmount),
        reason: 'Order cancelled by admin'
      })
      console.log('Refund request sent successfully')
    } catch (error) {
      console.error('Auto-refund failed (maybe not supported by payment method):', error)
      // Kita tetap lanjut cancel di database, tapi beri log bahwa refund manual mungkin diperlukan
    }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  })
  
  revalidatePath('/admin/orders')
}

export async function syncWithMidtrans(orderId: string, midtransOrderId: string) {
  if (!midtransOrderId) {
    return { success: false, error: 'Order does not have a Midtrans ID. It might be an old order.' }
  }

  try {
    console.log('Syncing order:', midtransOrderId)
    const statusResponse = await snap.transaction.status(midtransOrderId)
    console.log('Midtrans status response:', statusResponse)
    
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    let newStatus: 'PENDING' | 'PAID' | 'CANCELLED' = 'PENDING'

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        newStatus = 'PAID'
      }
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      newStatus = 'CANCELLED'
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: newStatus,
        paidAt: newStatus === 'PAID' ? new Date() : null
      }
    })

    revalidatePath('/admin/orders')
    return { success: true, status: newStatus }
  } catch (error: any) {
    console.error('Failed to sync with Midtrans:', error)
    // Jika error dari Midtrans (misal 404), tampilkan pesannya
    const midtransError = error?.ApiResponse?.status_message || error?.message || 'Unknown error'
    return { success: false, error: `Midtrans Error: ${midtransError}` }
  }
}
