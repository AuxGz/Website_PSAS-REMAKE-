import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import snap from '@/lib/midtrans'

export async function POST(request: NextRequest) {
  let orderIdToRollback: string | null = null;
  
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Ambil data dari request, HAPUS ekspektasi shippingCost dari frontend
    const { 
      selectedItemIds,
      shippingAddressId,
      shippingService
    } = await request.json()

    if (!shippingAddressId || !shippingService) {
      return NextResponse.json({ error: 'Data pengiriman tidak lengkap' }, { status: 400 })
    }

    if (!selectedItemIds || selectedItemIds.length === 0) {
      return NextResponse.json({ error: 'No items selected for checkout' }, { status: 400 })
    }

    // 2. Fetch Profile dan Cart Items (Validasi kepemilikan otomatis lewat where userId)
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

    // 3. Filter items yang dipilih
    const itemsToProcess = profile.cartItems.filter(item => selectedItemIds.includes(item.id))

    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: 'Selected items not found in cart' }, { status: 400 })
    }

    // 4. Fetch Shipping Address dan Validasi Milik User
    const shippingAddress = await prisma.shippingAddress.findUnique({
      where: { id: shippingAddressId }
    })

    if (!shippingAddress || shippingAddress.profileId !== profile.id) {
      return NextResponse.json({ error: 'Alamat pengiriman tidak valid atau bukan milik Anda' }, { status: 400 })
    }

    // 5. Validasi Stok & Hitung Berat
    let totalWeight = 0;
    for (const item of itemsToProcess) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({
          error: `Stock tidak cukup untuk ${item.product.name}. Tersedia: ${item.product.stock}`
        }, { status: 400 })
      }
      const weight = item.product.weight || 1000;
      totalWeight += (weight * item.quantity);
    }

    // 6. Hitung Subtotal Harga Barang
    const subtotal = itemsToProcess.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity, 0
    )

    // 7. Panggil API RajaOngkir Server-Side
    let serverShippingCost = 0;
    const ORIGIN_CITY_ID = '54'; // Banyumas
    
    // Asumsi frontend ngirim "JNE REG" atau "JNE YES"
    // Ekstrak courier (kata pertama) dan service (sisanya)
    const serviceParts = shippingService.split(' ');
    const COURIER = serviceParts[0].toLowerCase(); // "jne"
    const requestedService = serviceParts.slice(1).join(' ').toUpperCase(); // "REG" atau "YES"

    try {
      const apiKey = process.env.RAJAONGKIR_API_KEY
      if (!apiKey) throw new Error('RAJAONGKIR_API_KEY is not configured')
      
      const response = await fetch('https://api.rajaongkir.com/starter/cost', {
        method: 'POST',
        headers: {
          key: apiKey,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          origin: ORIGIN_CITY_ID,
          destination: shippingAddress.cityId,
          weight: String(Math.ceil(totalWeight)),
          courier: COURIER,
        }),
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`RajaOngkir error: ${errText}`)
      }
      
      const data = await response.json()
      const services = data.rajaongkir?.results?.[0]?.costs || []
      
      // Cocokkan serviceCode
      const matchedService = services.find((s: any) => s.service.toUpperCase() === requestedService)
      
      if (matchedService && matchedService.cost?.[0]?.value) {
        serverShippingCost = matchedService.cost[0].value
      } else {
        throw new Error('Service pengiriman tidak ditemukan di RajaOngkir')
      }
    } catch (error: any) {
      console.warn('RajaOngkir API failed, using fallback.', error.message)
      // Fallback calculation
      const isYes = requestedService.includes('YES');
      const baseCost = isYes ? 25000 : 15000;
      const additionalCost = isYes ? 15000 : 10000;
      serverShippingCost = baseCost + (Math.max(1, Math.ceil(totalWeight / 1000)) - 1) * additionalCost;
    }

    // 8. Hitung Total Akhir 100% Data Server
    const totalAmount = subtotal + serverShippingCost

    // Generate unique order ID
    const midtransOrderId = `SXG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    // 9. Buat Order di DB (Status PENDING)
    const order = await prisma.order.create({
      data: {
        profileId: profile.id,
        totalAmount: totalAmount,
        shippingCost: serverShippingCost,
        shippingService: shippingService,
        shippingAddressId: shippingAddress.id,
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
    
    // Simpan order ID untuk rollback jika midtrans gagal
    orderIdToRollback = order.id;

    // 10. Request ke Midtrans
    const itemDetails = itemsToProcess.map(item => ({
      id: item.productId,
      price: Math.round(Number(item.product.price)),
      quantity: item.quantity,
      name: item.product.name.substring(0, 50),
    }))

    if (serverShippingCost > 0) {
      itemDetails.push({
        id: 'SHIPPING',
        price: Math.round(serverShippingCost),
        quantity: 1,
        name: `Ongkos Kirim (${shippingService})`.substring(0, 50),
      })
    }

    const transactionParams = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(totalAmount),
      },
      item_details: itemDetails,
      customer_details: {
        first_name: profile.fullName || 'Customer',
        email: profile.email || '',
        phone: shippingAddress.phone || '-',
      }
    }

    const snapTransaction = await snap.createTransaction(transactionParams)

    // 11. Midtrans SUKSES - Finalisasi Data
    // Update token
    await prisma.order.update({
      where: { id: order.id },
      data: { midtransToken: snapTransaction.token }
    })

    // Potong Stok
    for (const item of itemsToProcess) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      })
    }

    // Kosongkan Cart yang di-checkout
    await prisma.cartItem.deleteMany({
      where: { 
        id: { in: itemsToProcess.map(item => item.id) }
      }
    })

    return NextResponse.json({
      token: snapTransaction.token,
      redirectUrl: snapTransaction.redirect_url,
      orderId: order.id,
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    
    // ROLLBACK jika gagal memproses midtrans atau lainnya, dan order sudah terlanjur terbuat
    if (orderIdToRollback) {
      try {
        await prisma.order.delete({
          where: { id: orderIdToRollback }
        })
        console.log(`Rolled back order ${orderIdToRollback}`)
      } catch (rollbackError) {
        console.error('Failed to rollback order:', rollbackError)
      }
    }

    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    )
  }
}
