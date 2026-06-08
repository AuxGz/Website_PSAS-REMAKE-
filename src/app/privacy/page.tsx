import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | SummitXGear',
  description:
    'Kebijakan Privasi SummitXGear — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai UU PDP Indonesia.',
}
export const dynamic = 'force-static'

const LAST_UPDATED = '8 Juni 2026'

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Decorative blurs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[140px]" />
        <div className="absolute -bottom-[15%] -right-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[140px]" />
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
            Kebijakan <span className="text-secondary">Privasi</span>
          </h1>
          <p className="mt-4 text-sm tracking-wide text-zinc-500">
            Terakhir diperbarui: {LAST_UPDATED}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-12 text-[15px] leading-relaxed text-zinc-400 [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:text-zinc-200">
          <section>
            <p>
              PT SummitXGear Indonesia (&quot;SummitXGear&quot;, &quot;kami&quot;, &quot;kita&quot;) berkomitmen melindungi
              data pribadi Anda sesuai dengan <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi
              (UU PDP)</strong> beserta peraturan pelaksanaannya. Kebijakan ini menjelaskan bagaimana kami mengumpulkan,
              menggunakan, menyimpan, dan melindungi data Anda saat menggunakan layanan kami melalui situs web{' '}
              <strong>summitxgear.com</strong> dan seluruh platform digital kami.
            </p>
          </section>

          <section>
            <h2>1. Data Pribadi yang Kami Kumpulkan</h2>
            <h3>1.1 Data yang Anda Berikan Secara Langsung</h3>
            <ul>
              <li><strong>Data Identitas:</strong> Nama lengkap, alamat email, nomor telepon saat Anda mendaftar akun.</li>
              <li><strong>Data Alamat Pengiriman:</strong> Alamat lengkap, kota, provinsi, kode pos, titik koordinat (opsional) untuk keperluan pengiriman barang.</li>
              <li><strong>Data Transaksi:</strong> Riwayat pesanan, metode pembayaran yang dipilih, nominal pembayaran. Kami <strong>tidak</strong> menyimpan nomor kartu kredit/debit Anda — pemrosesan pembayaran ditangani oleh Midtrans.</li>
              <li><strong>Data Konten Pengguna:</strong> Ulasan produk, rating, dan foto profil yang Anda unggah.</li>
            </ul>
            <h3>1.2 Data yang Dikumpulkan Secara Otomatis</h3>
            <ul>
              <li><strong>Data Perangkat:</strong> Jenis browser, sistem operasi, resolusi layar.</li>
              <li><strong>Data Aktivitas:</strong> Halaman yang dikunjungi, waktu kunjungan, produk yang dilihat melalui Vercel Analytics.</li>
              <li><strong>Cookies:</strong> Session cookies untuk otentikasi Supabase. Selengkapnya di{' '}
                <Link href="/cookies" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">Kebijakan Cookie</Link>.
              </li>
            </ul>
          </section>

          <section>
            <h2>2. Dasar Hukum Pemrosesan Data</h2>
            <p>Sesuai <strong>Pasal 20 UU PDP</strong>, kami memproses data pribadi Anda berdasarkan:</p>
            <ul>
              <li><strong>Persetujuan Anda (Pasal 20 ayat 2a):</strong> Saat Anda membuat akun dan menyetujui Kebijakan Privasi ini.</li>
              <li><strong>Pelaksanaan Perjanjian (Pasal 20 ayat 2b):</strong> Untuk memproses pesanan, pengiriman, dan pengembalian barang.</li>
              <li><strong>Kepentingan Sah (Pasal 20 ayat 2f):</strong> Untuk pencegahan penipuan, keamanan platform, dan peningkatan layanan.</li>
              <li><strong>Kewajiban Hukum (Pasal 20 ayat 2c):</strong> Untuk memenuhi kewajiban perpajakan dan regulasi e-commerce Indonesia.</li>
            </ul>
          </section>

          <section>
            <h2>3. Tujuan Penggunaan Data</h2>
            <ul>
              <li>Memproses dan mengirimkan pesanan Anda, termasuk kalkulasi ongkos kirim melalui API RajaOngkir.</li>
              <li>Mengelola akun pengguna Anda dan menyediakan layanan pelanggan.</li>
              <li>Memproses pembayaran melalui payment gateway Midtrans.</li>
              <li>Mengirimkan notifikasi terkait status pesanan dan informasi transaksional.</li>
              <li>Menganalisis pola penggunaan untuk meningkatkan pengalaman berbelanja (Vercel Analytics).</li>
              <li>Mencegah penipuan dan menjaga keamanan platform.</li>
            </ul>
          </section>

          <section>
            <h2>4. Pemroses Data Pihak Ketiga (Data Processors)</h2>
            <p>Kami menggunakan penyedia layanan pihak ketiga yang bertindak sebagai <strong>pemroses data</strong> sesuai Pasal 51 UU PDP:</p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-4 py-3 font-semibold text-zinc-200">Penyedia</th>
                    <th className="px-4 py-3 font-semibold text-zinc-200">Fungsi</th>
                    <th className="px-4 py-3 font-semibold text-zinc-200">Lokasi Server</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Supabase Inc.</td>
                    <td className="px-4 py-3">Database, autentikasi pengguna, penyimpanan file</td>
                    <td className="px-4 py-3">AWS Asia Pacific (Sydney)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Vercel Inc.</td>
                    <td className="px-4 py-3">Hosting aplikasi web, CDN, dan analytics</td>
                    <td className="px-4 py-3">Edge Network Global</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">PT Midtrans (GoTo Financial)</td>
                    <td className="px-4 py-3">Pemrosesan pembayaran</td>
                    <td className="px-4 py-3">Indonesia</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">RajaOngkir</td>
                    <td className="px-4 py-3">Kalkulasi ongkos kirim</td>
                    <td className="px-4 py-3">Indonesia</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Sesuai <strong>Pasal 55 UU PDP</strong>, apabila terjadi transfer data ke luar wilayah hukum Indonesia
              (Supabase di Australia, Vercel di jaringan global), kami memastikan bahwa negara penerima memiliki tingkat
              pelindungan data yang setara atau perjanjian pemrosesan data telah ditandatangani.
            </p>
          </section>

          <section>
            <h2>5. Hak Anda sebagai Subjek Data (Pasal 5-13 UU PDP)</h2>
            <p>Anda memiliki hak-hak berikut atas data pribadi Anda:</p>
            <ul>
              <li><strong>Hak Akses:</strong> Meminta salinan data pribadi Anda yang kami proses.</li>
              <li><strong>Hak Koreksi:</strong> Memperbarui atau memperbaiki data yang tidak akurat melalui halaman profil Anda.</li>
              <li><strong>Hak Hapus:</strong> Meminta penghapusan data Anda (kecuali jika kami diwajibkan menyimpannya berdasarkan hukum).</li>
              <li><strong>Hak Tarik Persetujuan:</strong> Menarik persetujuan yang sebelumnya Anda berikan kapan saja.</li>
              <li><strong>Hak Keberatan:</strong> Mengajukan keberatan atas pemrosesan data untuk tujuan pemasaran langsung.</li>
              <li><strong>Hak Portabilitas:</strong> Meminta data Anda dalam format yang dapat dibaca mesin.</li>
            </ul>
            <p className="mt-4">
              Untuk menggunakan hak-hak di atas, hubungi kami melalui <strong>privacy@summitxgear.com</strong>. Kami akan
              menanggapi permintaan Anda dalam waktu <strong>3×24 jam</strong> kerja sesuai Pasal 10 UU PDP.
            </p>
          </section>

          <section>
            <h2>6. Keamanan Data</h2>
            <ul>
              <li>Semua koneksi menggunakan enkripsi <strong>TLS 1.3</strong>.</li>
              <li>Password di-hash menggunakan algoritma <strong>bcrypt</strong> oleh Supabase Auth.</li>
              <li><strong>Row Level Security (RLS)</strong> diterapkan di tingkat database — setiap pengguna hanya dapat mengakses data miliknya sendiri.</li>
              <li>API checkout memvalidasi semua kalkulasi harga di sisi server untuk mencegah manipulasi.</li>
              <li>Akses admin dilindungi oleh sistem JWT claims berlapis.</li>
            </ul>
          </section>

          <section>
            <h2>7. Retensi Data</h2>
            <ul>
              <li><strong>Data Akun:</strong> Disimpan selama akun Anda aktif. Setelah penghapusan akun, data dihapus dalam 30 hari.</li>
              <li><strong>Data Transaksi:</strong> Disimpan selama <strong>5 tahun</strong> sesuai kewajiban perpajakan (UU KUP Pasal 28 ayat 11).</li>
              <li><strong>Data Log:</strong> Disimpan selama 90 hari untuk keperluan keamanan dan debugging.</li>
            </ul>
          </section>

          <section>
            <h2>8. Perlindungan Data Anak</h2>
            <p>
              Layanan kami tidak ditujukan untuk anak di bawah <strong>18 tahun</strong>. Kami tidak secara sengaja
              mengumpulkan data pribadi anak-anak. Jika Anda mengetahui bahwa anak Anda telah memberikan data pribadi
              kepada kami, hubungi kami segera untuk penghapusan data tersebut.
            </p>
          </section>

          <section>
            <h2>9. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan material akan diberitahukan melalui
              email atau banner di situs web kami minimal <strong>14 hari</strong> sebelum berlaku efektif, sesuai Pasal 14
              UU PDP.
            </p>
          </section>

          <section>
            <h2>10. Kontak</h2>
            <p>Jika Anda memiliki pertanyaan atau keluhan terkait perlindungan data pribadi:</p>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-2">
              <p><strong>PT SummitXGear Indonesia</strong></p>
              <p>Data Protection Officer (DPO)</p>
              <p>Email: <a href="mailto:summitxgear@gmail.com" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">summitxgear@gmail.com</a></p>
              <p>Alamat: Jl. Raya Banyumas No. 1, Purwokerto, Jawa Tengah, Indonesia</p>
              <p className="mt-4 text-xs text-zinc-500">
                Apabila keluhan Anda tidak terselesaikan, Anda berhak mengajukan pengaduan kepada <strong className="text-zinc-400">Lembaga Pelindungan Data Pribadi</strong> sebagaimana diamanatkan oleh UU PDP.
              </p>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}
