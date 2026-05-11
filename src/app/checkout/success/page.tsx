import Link from 'next/link'
import Card from '@/components/ui/Card'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6" hover={false}>
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        
        <div>
          <h1 className="text-3xl font-light italic mb-2">Payment Successful</h1>
          <p className="text-zinc-500 text-sm font-light">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-3">
          <Link href="/profile" className="block w-full rounded-xl bg-secondary py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-white hover:bg-secondary/90 transition-all">
            View Order Status
          </Link>
          <Link href="/products" className="block w-full rounded-xl border border-white/10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Continue Shopping
          </Link>
        </div>
      </Card>
    </div>
  )
}
