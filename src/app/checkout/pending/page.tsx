import Link from 'next/link'
import Card from '@/components/ui/Card'

export default function CheckoutPendingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6" hover={false}>
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        
        <div>
          <h1 className="text-3xl font-light italic mb-2">Payment Pending</h1>
          <p className="text-zinc-500 text-sm font-light">
            We are waiting for your payment to be completed. Please finish the transaction according to the instructions provided.
          </p>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-3">
          <Link href="/profile" className="block w-full rounded-xl bg-yellow-500/10 border border-yellow-500/20 py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all">
            Check Order Status
          </Link>
          <Link href="/products" className="block w-full rounded-xl border border-white/10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Continue Shopping
          </Link>
        </div>
      </Card>
    </div>
  )
}
