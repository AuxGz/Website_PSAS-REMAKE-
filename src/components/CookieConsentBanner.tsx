'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'summitxgear-cookie-consent'

type ConsentValue = 'all' | 'essential' | null

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState<ConsentValue>(null)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === 'all' || stored === 'essential') {
      setConsent(stored)
    } else {
      // Show banner after a small delay for smooth appearance
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleConsent = (value: 'all' | 'essential') => {
    setExiting(true)
    setTimeout(() => {
      localStorage.setItem(COOKIE_CONSENT_KEY, value)
      setConsent(value)
      setVisible(false)
      setExiting(false)

      // If user chose essential only, attempt to disable analytics
      if (value === 'essential') {
        // Vercel Analytics respects this flag
        window.localStorage.setItem('va_disabled', '1')
      }
    }, 300)
  }

  // Don't render anything if consent already given or banner not visible
  if (consent || !visible) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-500 ease-out ${
        exiting
          ? 'translate-y-full opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Backdrop gradient */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative border-t border-white/[0.06] bg-[#0c1120]/95 backdrop-blur-2xl">
        <div className="mx-auto max-w-6xl px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Text */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <h3 className="text-sm font-semibold text-foreground">Kami menggunakan cookie</h3>
              </div>
              <p className="max-w-xl text-[13px] leading-relaxed text-zinc-400">
                Situs ini menggunakan cookie esensial untuk autentikasi (Supabase) dan cookie analitik opsional 
                (Vercel Analytics) untuk meningkatkan performa.{' '}
                <Link
                  href="/cookies"
                  className="text-secondary underline underline-offset-4 transition-colors hover:text-white"
                >
                  Pelajari selengkapnya
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                id="cookie-consent-essential"
                onClick={() => handleConsent('essential')}
                className="rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white active:scale-[0.97]"
              >
                Hanya Esensial
              </button>
              <button
                id="cookie-consent-all"
                onClick={() => handleConsent('all')}
                className="rounded-xl bg-secondary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-secondary/90 active:scale-[0.97]"
              >
                Terima Semua
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
