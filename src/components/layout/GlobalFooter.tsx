'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function GlobalFooter() {
  const pathname = usePathname()
  
  // Do not show the global footer on these pages
  const hideFooterRoutes = [
    '/', // Has its own sliding footer
    '/login', // Fullscreen auth page
  ]

  // Also hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null
  }

  if (hideFooterRoutes.includes(pathname)) {
    return null
  }

  return <Footer />
}
