import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kebijakan Cookie | SummitXGear',
  description:
    'Kebijakan Cookie SummitXGear — jenis cookie yang digunakan, tujuannya, dan cara mengelola preferensi cookie Anda.',
}

const LAST_UPDATED = '8 Juni 2026'

export default function CookiePolicyPage() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Decorative blurs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[15%] left-[20%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[140px]" />
        <div className="absolute -bottom-[10%] -right-[15%] h-[35%] w-[35%] rounded-full bg-accent/5 blur-[140px]" />
      </div>

      <article className="relative z-10 mx-auto max-w-3xl px-6 py-24 sm:px-8 lg:py-32">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Kebijakan <span className="text-secondary">Cookie</span>
          </h1>
          <p className="mt-4 text-sm tracking-wide text-zinc-500">
            Terakhir diperbarui: {LAST_UPDATED}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-12 text-[15px] leading-relaxed text-zinc-400 [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:text-zinc-200">
          <section>
            <p>
              Halaman ini menjelaskan apa itu cookie, jenis cookie apa saja yang digunakan oleh{' '}
              <strong>summitxgear.com</strong>, mengapa kami menggunakannya, dan bagaimana Anda dapat mengelola
              preferensi cookie Anda.
            </p>
          </section>

          <section>
            <h2>1. Apa Itu Cookie?</h2>
            <p>
              Cookie adalah file teks kecil yang disimpan di perangkat Anda (komputer, tablet, atau smartphone) saat
              Anda mengunjungi situs web. Cookie memungkinkan situs web mengenali perangkat Anda dan menyimpan
              preferensi atau informasi tertentu untuk meningkatkan pengalaman browsing Anda.
            </p>
            <p className="mt-3">
              Cookie juga bisa berupa <strong>local storage</strong> atau <strong>session storage</strong> yang
              memiliki fungsi serupa namun mekanisme penyimpanan yang berbeda.
            </p>
          </section>

          <section>
            <h2>2. Cookie yang Kami Gunakan</h2>
            <p>
              Berikut adalah daftar lengkap cookie dan teknologi penyimpanan yang digunakan di situs kami:
            </p>

            {/* Cookie Table */}
            <div className="mt-6 space-y-8">
              {/* Essential Cookies */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="!mt-0 !mb-0">Cookie Esensial (Wajib)</h3>
                    <p className="text-xs text-zinc-500">Tidak dapat dinonaktifkan — diperlukan agar situs berfungsi</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-4 py-3 font-semibold text-zinc-200">Nama Cookie</th>
                        <th className="px-4 py-3 font-semibold text-zinc-200">Penyedia</th>
                        <th className="px-4 py-3 font-semibold text-zinc-200">Tujuan</th>
                        <th className="px-4 py-3 font-semibold text-zinc-200">Masa Berlaku</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-4 py-3 font-mono text-xs text-secondary">sb-*-auth-token</td>
                        <td className="px-4 py-3">Supabase</td>
                        <td className="px-4 py-3">Menyimpan session token autentikasi pengguna. Diperlukan agar Anda tetap login saat berpindah halaman.</td>
                        <td className="px-4 py-3 text-zinc-500">Session / 1 jam</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-xs text-secondary">sb-*-auth-token-code-verifier</td>
                        <td className="px-4 py-3">Supabase</td>
                        <td className="px-4 py-3">PKCE code verifier untuk OAuth flow (Google, Discord, Facebook login). Memastikan keamanan proses autentikasi.</td>
                        <td className="px-4 py-3 text-zinc-500">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="!mt-0 !mb-0">Cookie Analitik (Opsional)</h3>
                    <p className="text-xs text-zinc-500">Dapat dinonaktifkan — digunakan untuk memahami pola penggunaan</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-4 py-3 font-semibold text-zinc-200">Nama Cookie</th>
                        <th className="px-4 py-3 font-semibold text-zinc-200">Penyedia</th>
                        <th className="px-4 py-3 font-semibold text-zinc-200">Tujuan</th>
                        <th className="px-4 py-3 font-semibold text-zinc-200">Masa Berlaku</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-4 py-3 font-mono text-xs text-secondary">va</td>
                        <td className="px-4 py-3">Vercel Analytics</td>
                        <td className="px-4 py-3">Mengukur performa halaman dan metrik Web Vitals tanpa mengumpulkan data pribadi. Data bersifat anonim dan agregat.</td>
                        <td className="px-4 py-3 text-zinc-500">Session</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-xs text-secondary">_vercel_insights</td>
                        <td className="px-4 py-3">Vercel Speed Insights</td>
                        <td className="px-4 py-3">Memantau kecepatan muat halaman (LCP, FID, CLS) untuk optimasi performa. Tidak menyimpan data identifikasi pengguna.</td>
                        <td className="px-4 py-3 text-zinc-500">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2>3. Cookie Pihak Ketiga</h2>
            <p>
              Saat Anda memilih login melalui penyedia OAuth (Google, Discord, Facebook), penyedia tersebut mungkin
              menyetel cookie mereka sendiri di perangkat Anda. Cookie ini diatur oleh kebijakan privasi masing-masing
              penyedia:
            </p>
            <ul>
              <li>
                <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">
                  Google — Kebijakan Cookie
                </a>
              </li>
              <li>
                <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">
                  Discord — Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/policies/cookies/" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">
                  Facebook — Kebijakan Cookie
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Cara Mengelola Cookie</h2>
            <h3>4.1 Melalui Cookie Consent Banner</h3>
            <p>
              Saat pertama kali mengunjungi situs kami, Anda akan melihat banner persetujuan cookie. Anda dapat memilih
              untuk menerima semua cookie atau hanya cookie esensial saja. Preferensi Anda disimpan dan dapat diubah
              kapan saja.
            </p>
            <h3>4.2 Melalui Pengaturan Browser</h3>
            <p>
              Anda dapat mengatur atau menghapus cookie melalui pengaturan browser Anda. Berikut panduan untuk browser
              populer:
            </p>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">
                  Google Chrome — Kelola Cookie
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/id/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">
                  Mozilla Firefox — Enhanced Tracking Protection
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/id-id/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">
                  Safari — Kelola Cookie
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/id-id/microsoft-edge/menghapus-cookie-di-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">
                  Microsoft Edge — Hapus Cookie
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
              <p className="mb-2 text-sm font-semibold text-amber-400">⚠ Perhatian</p>
              <p className="text-sm text-amber-200/80">
                Menonaktifkan cookie esensial (Supabase Auth) akan menyebabkan Anda tidak dapat login atau menggunakan
                fitur-fitur yang memerlukan autentikasi seperti checkout, profil, dan riwayat pesanan.
              </p>
            </div>
          </section>

          <section>
            <h2>5. Opt-Out dari Analytics</h2>
            <p>
              Jika Anda tidak ingin data aktivitas Anda dikumpulkan oleh Vercel Analytics, Anda dapat:
            </p>
            <ul>
              <li>Klik <strong>&quot;Hanya Esensial&quot;</strong> pada cookie consent banner saat pertama kali berkunjung.</li>
              <li>Mengaktifkan fitur <strong>Do Not Track (DNT)</strong> di browser Anda — kami menghormati sinyal DNT.</li>
              <li>Menggunakan browser extension seperti <strong>uBlock Origin</strong> atau <strong>Privacy Badger</strong>.</li>
              <li>Menggunakan mode <strong>Private/Incognito</strong> di browser Anda.</li>
            </ul>
          </section>

          <section>
            <h2>6. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui Kebijakan Cookie ini sewaktu-waktu untuk mencerminkan perubahan teknologi atau
              regulasi. Perubahan akan dipublikasikan di halaman ini dengan tanggal pembaruan yang baru.
            </p>
          </section>

          <section>
            <h2>7. Kontak</h2>
            <p>
              Pertanyaan tentang cookie dan privasi dapat ditujukan kepada:
            </p>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-2">
              <p><strong>PT SummitXGear Indonesia</strong></p>
              <p>Email: <a href="mailto:summitxgear@gmail.com" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">summitxgear@gmail.com</a></p>
              <p>
                Untuk informasi lebih lanjut, lihat{' '}
                <Link href="/privacy" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">Kebijakan Privasi</Link>{' '}
                kami.
              </p>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}
