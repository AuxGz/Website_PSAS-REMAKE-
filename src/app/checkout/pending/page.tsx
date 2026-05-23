import PendingClient from '@/components/PendingClient'

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const { order_id } = await searchParams

  const isProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
  const snapUrl = isProd
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';


  return (
    <PendingClient 
        orderId={order_id || null} 
        snapUrl={snapUrl} 
        clientKey={clientKey} 
    />
  )
}
