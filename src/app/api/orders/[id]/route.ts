import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { 
        midtransOrderId: id // We often use midtransOrderId as the reference in URLs
      },
      select: {
        midtransToken: true,
        profile: { select: { userId: true } }
      }
    })

    // Fallback search by internal UUID if not found by midtrans ID
    let finalOrder = order
    if (!finalOrder) {
        finalOrder = await prisma.order.findUnique({
            where: { id: id },
            select: {
                midtransToken: true,
                profile: { select: { userId: true } }
            }
        })
    }

    if (!finalOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Security check: only the owner can see their token
    if (finalOrder.profile.userId !== user.id) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ token: finalOrder.midtransToken })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
