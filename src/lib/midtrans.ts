import midtransClient from 'midtrans-client'

// Server-side only — keys are NOT prefixed with NEXT_PUBLIC_
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

export default snap
