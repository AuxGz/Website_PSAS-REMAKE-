import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { revalidatePath } from 'next/cache'
import StatusActions from './StatusActions'

export default async function AdminOrdersPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const user = authUser ? await prisma.profile.findUnique({
    where: { userId: authUser.id }
  }) : null

  if (user?.role !== 'ADMIN') {
    redirect('/')
  }

  const orders = await prisma.order.findMany({
    include: {
      profile: true,
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })


  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link href="/admin" className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-light italic tracking-tight">Order <span className="font-serif">Fulfillment.</span></h1>
          <p className="mt-2 text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">Monitor and manage customer transactions</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className={`p-8 border-white/5 bg-primary/20 backdrop-blur-xl transition-all duration-500 ${order.status === 'CANCELLED' ? 'opacity-40 grayscale-[0.5] pointer-events-none border-dashed' : ''
                }`}
              hover={false}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500">Order ID: {order.id.slice(0, 8)}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${
                      order.status === 'PAID' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 
                      order.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                      order.status === 'PROCESSING' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                      order.status === 'CANCELLED' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                      'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-light italic">{order.profile?.fullName || 'Anonymous Customer'}</h3>
                  <p className="text-sm text-zinc-500 font-light">{order.profile?.email}</p>
                </div>

                <div className="flex-1 lg:max-w-md">
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-zinc-400 font-light">{item.product.name} x {item.quantity}</span>
                        <span className="font-medium text-foreground">Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-end">
                      <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500">Total Amount</span>
                      <span className="text-2xl font-light italic text-accent">Rp {Number(order.totalAmount).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4">
                  <div className="text-[10px] tracking-[0.1em] uppercase text-zinc-500 font-bold">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <StatusActions
                    orderId={order.id}
                    currentStatus={order.status}
                    midtransOrderId={order.midtransOrderId || ''}
                  />
                </div>
              </div>
            </Card>
          ))}

          {orders.length === 0 && (
            <Card className="py-20 text-center border-white/5 bg-primary/20" hover={false}>
              <p className="text-zinc-500 font-light italic">No orders have been placed yet.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
