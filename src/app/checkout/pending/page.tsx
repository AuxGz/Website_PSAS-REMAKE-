import PendingClient from '@/components/PendingClient'

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const { order_id } = await searchParams

  const snapUrl = process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
    
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || ''

  return (
    <PendingClient 
        orderId={order_id || null} 
        snapUrl={snapUrl} 
        clientKey={clientKey} 
    />
  )
}
