import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | SummitXGear',
  description:
    'Syarat dan Ketentuan layanan e-commerce SummitXGear — governing law hukum Indonesia, kebijakan retur, dan ketentuan penggunaan.',
}

const LAST_UPDATED = '8 Juni 2026'

export default function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Decorative blurs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[15%] -right-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[140px]" />
        <div className="absolute -bottom-[15%] -left-[10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[140px]" />
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
            Syarat & <span className="text-secondary">Ketentuan</span>
          </h1>
          <p className="mt-4 text-sm tracking-wide text-zinc-500">
            Terakhir diperbarui: {LAST_UPDATED}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-12 text-[15px] leading-relaxed text-zinc-400 [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:text-zinc-200">
          <section>
            <p>
              Syarat dan Ketentuan ini (&quot;Perjanjian&quot;) merupakan perjanjian hukum yang mengikat antara Anda
              (&quot;Pelanggan&quot;, &quot;Anda&quot;) dan <strong>PT SummitXGear Indonesia</strong> (&quot;SummitXGear&quot;,
              &quot;kami&quot;) yang mengatur penggunaan situs web <strong>summitxgear.com</strong> dan seluruh layanan
              e-commerce yang kami sediakan. Dengan mengakses atau menggunakan layanan kami, Anda menyatakan telah membaca,
              memahami, dan menyetujui seluruh ketentuan dalam Perjanjian ini.
            </p>
          </section>

          <section>
            <h2>1. Ketentuan Umum</h2>
            <h3>1.1 Kelayakan</h3>
            <p>
              Anda harus berusia minimal <strong>18 tahun</strong> atau memiliki persetujuan orang tua/wali yang sah untuk
              menggunakan layanan kami. Dengan membuat akun, Anda menyatakan bahwa data yang diberikan adalah akurat dan
              terkini.
            </p>
            <h3>1.2 Akun Pengguna</h3>
            <ul>
              <li>Anda bertanggung jawab penuh atas keamanan akun dan password Anda.</li>
              <li>Segala aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda.</li>
              <li>Kami berhak menonaktifkan akun yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya.</li>
              <li>Satu orang hanya diperkenankan memiliki satu akun aktif.</li>
            </ul>
          </section>

          <section>
            <h2>2. Produk & Harga</h2>
            <h3>2.1 Informasi Produk</h3>
            <p>
              Kami berusaha menampilkan deskripsi produk, gambar, dan spesifikasi seakurat mungkin. Namun, kami tidak
              menjamin bahwa warna yang ditampilkan di layar Anda identik dengan warna asli produk. Perbedaan minor
              dapat terjadi karena perbedaan kalibrasi monitor.
            </p>
            <h3>2.2 Harga</h3>
            <ul>
              <li>Semua harga ditampilkan dalam <strong>Rupiah (IDR)</strong> dan sudah termasuk PPN 11%.</li>
              <li>Ongkos kirim dihitung secara terpisah berdasarkan berat produk dan lokasi pengiriman melalui API RajaOngkir.</li>
              <li>Kami berhak mengubah harga sewaktu-waktu tanpa pemberitahuan. Harga yang berlaku adalah harga pada saat Anda menyelesaikan checkout.</li>
              <li>Seluruh kalkulasi harga dan ongkos kirim divalidasi di sisi server — harga yang ditampilkan di halaman checkout bersifat final.</li>
            </ul>
            <h3>2.3 Ketersediaan Stok</h3>
            <p>
              Produk yang ditampilkan tergantung ketersediaan stok. Kami berhak menolak atau membatalkan pesanan apabila
              stok tidak mencukupi, meskipun pembayaran telah dilakukan. Dalam hal ini, pembayaran akan dikembalikan
              secara penuh.
            </p>
          </section>

          <section>
            <h2>3. Pemesanan & Pembayaran</h2>
            <h3>3.1 Proses Pemesanan</h3>
            <ol>
              <li>Pilih produk dan tambahkan ke keranjang belanja.</li>
              <li>Pilih alamat pengiriman dan layanan kurir.</li>
              <li>Lakukan pembayaran melalui payment gateway <strong>Midtrans</strong>.</li>
              <li>Pesanan akan diproses setelah pembayaran terkonfirmasi.</li>
            </ol>
            <h3>3.2 Metode Pembayaran</h3>
            <p>
              Kami menerima pembayaran melalui metode yang disediakan oleh <strong>PT Midtrans (GoTo Financial)</strong>,
              termasuk namun tidak terbatas pada: transfer bank, e-wallet (GoPay, OVO, DANA, ShopeePay), kartu
              kredit/debit, dan virtual account. Seluruh transaksi pembayaran diproses dan dilindungi oleh Midtrans
              sesuai standar <strong>PCI DSS</strong>.
            </p>
            <h3>3.3 Konfirmasi Pesanan</h3>
            <p>
              Pesanan dianggap sah setelah pembayaran terkonfirmasi oleh sistem. Kami berhak membatalkan pesanan yang
              terindikasi penipuan atau pelanggaran ketentuan.
            </p>
          </section>

          <section>
            <h2>4. Pengiriman</h2>
            <h3>4.1 Wilayah Pengiriman</h3>
            <p>
              Kami melayani pengiriman ke seluruh wilayah Indonesia melalui jasa kurir yang tersedia (JNE, dan layanan
              lainnya yang didukung oleh platform kami). Pengiriman dilakukan dari gudang kami di <strong>Banyumas, Jawa Tengah</strong>.
            </p>
            <h3>4.2 Estimasi Waktu Pengiriman</h3>
            <ul>
              <li>Pesanan diproses dalam <strong>1-2 hari kerja</strong> setelah pembayaran terkonfirmasi.</li>
              <li>Estimasi waktu pengiriman tergantung pada layanan kurir yang dipilih dan lokasi tujuan.</li>
              <li>Kami tidak bertanggung jawab atas keterlambatan yang disebabkan oleh force majeure, bencana alam, atau kebijakan pemerintah.</li>
            </ul>
            <h3>4.3 Risiko Pengiriman</h3>
            <p>
              Risiko kehilangan atau kerusakan barang berpindah kepada Anda setelah barang diterima oleh jasa kurir.
              Kami menyarankan untuk merekam video saat membuka paket (unboxing) sebagai bukti apabila terjadi kerusakan.
            </p>
          </section>

          <section>
            <h2>5. Kebijakan Pengembalian & Refund</h2>
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
              <p className="mb-2 text-sm font-semibold text-amber-400">⚠ Penting</p>
              <p className="text-sm text-amber-200/80">
                Mohon baca kebijakan pengembalian dengan seksama sebelum melakukan pembelian.
              </p>
            </div>
            <h3>5.1 Syarat Pengembalian</h3>
            <p>Pengembalian produk hanya dapat dilakukan apabila:</p>
            <ul>
              <li>Produk yang diterima <strong>cacat produksi</strong> atau <strong>tidak sesuai</strong> dengan deskripsi.</li>
              <li>Produk yang diterima <strong>berbeda</strong> dari yang dipesan (salah kirim).</li>
              <li>Permintaan pengembalian diajukan dalam <strong>7 hari kalender</strong> sejak tanggal penerimaan barang.</li>
              <li>Produk dalam kondisi belum dipakai, masih memiliki label/tag asli, dan dalam kemasan original.</li>
            </ul>
            <h3>5.2 Produk yang Tidak Dapat Dikembalikan</h3>
            <ul>
              <li>Produk yang telah digunakan, dicuci, atau rusak oleh Pelanggan.</li>
              <li>Produk sale/diskon dengan label &quot;Final Sale&quot;.</li>
              <li>Produk custom/personalisasi.</li>
            </ul>
            <h3>5.3 Proses Refund</h3>
            <ul>
              <li>Setelah pengembalian disetujui, refund akan diproses dalam <strong>7-14 hari kerja</strong>.</li>
              <li>Refund dikembalikan melalui metode pembayaran yang sama saat pemesanan.</li>
              <li>Ongkos kirim pengembalian ditanggung oleh kami apabila pengembalian disebabkan kesalahan kami.</li>
              <li>Apabila pengembalian karena perubahan pikiran Pelanggan (change of mind), biaya kirim retur ditanggung Pelanggan.</li>
            </ul>
          </section>

          <section>
            <h2>6. Hak Kekayaan Intelektual</h2>
            <p>
              Seluruh konten di situs ini — termasuk namun tidak terbatas pada logo, gambar, teks, desain, dan kode sumber — adalah
              milik PT SummitXGear Indonesia atau pemberi lisensinya dan dilindungi oleh hukum hak cipta Indonesia
              (<strong>UU No. 28 Tahun 2014</strong>) dan hukum internasional yang berlaku. Dilarang keras menyalin,
              mereproduksi, atau mendistribusikan konten tanpa izin tertulis dari kami.
            </p>
          </section>

          <section>
            <h2>7. Pembatasan Tanggung Jawab</h2>
            <ul>
              <li>SummitXGear tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan kami.</li>
              <li>Total tanggung jawab kami tidak akan melebihi jumlah yang Anda bayarkan untuk pesanan yang bersangkutan.</li>
              <li>Kami tidak bertanggung jawab atas gangguan layanan yang disebabkan oleh pemeliharaan sistem, kegagalan infrastruktur pihak ketiga, atau force majeure.</li>
            </ul>
          </section>

          <section>
            <h2>8. Hukum yang Berlaku & Penyelesaian Sengketa</h2>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-3">
              <p>
                Perjanjian ini <strong>diatur dan ditafsirkan berdasarkan hukum Negara Republik Indonesia</strong>.
              </p>
              <p>
                Setiap sengketa yang timbul dari atau berkaitan dengan Perjanjian ini akan diselesaikan melalui:
              </p>
              <ol>
                <li><strong>Musyawarah untuk mufakat</strong> antara para pihak dalam waktu 30 hari.</li>
                <li>Apabila musyawarah tidak tercapai, sengketa akan diselesaikan melalui <strong>Badan Penyelesaian Sengketa Konsumen (BPSK)</strong> setempat atau <strong>Pengadilan Negeri Purwokerto</strong> yang berwenang.</li>
              </ol>
              <p className="text-xs text-zinc-500">
                Referensi: UU No. 8 Tahun 1999 tentang Perlindungan Konsumen, PP No. 80 Tahun 2019 tentang Perdagangan Melalui Sistem Elektronik (PMSE).
              </p>
            </div>
          </section>

          <section>
            <h2>9. Kebijakan Penggunaan yang Dilarang</h2>
            <p>Anda dilarang menggunakan layanan kami untuk:</p>
            <ul>
              <li>Melanggar hukum atau peraturan yang berlaku di Indonesia.</li>
              <li>Melakukan penipuan, termasuk manipulasi harga atau eksploitasi bug sistem.</li>
              <li>Mendaftarkan banyak akun untuk menyalahgunakan promosi.</li>
              <li>Menggunakan bot, scraper, atau alat otomatis untuk mengakses layanan kami tanpa izin.</li>
              <li>Mengirimkan konten yang bersifat SARA, pornografi, atau melanggar norma kesusilaan.</li>
            </ul>
          </section>

          <section>
            <h2>10. Perubahan Ketentuan</h2>
            <p>
              Kami berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif setelah
              dipublikasikan di halaman ini. Penggunaan layanan Anda secara berkelanjutan setelah perubahan dipublikasikan
              dianggap sebagai persetujuan Anda terhadap ketentuan yang telah diubah.
            </p>
          </section>

          <section>
            <h2>11. Kontak</h2>
            <p>Pertanyaan mengenai Syarat dan Ketentuan ini dapat ditujukan kepada:</p>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-2">
              <p><strong>PT SummitXGear Indonesia</strong></p>
              <p>Email: <a href="mailto:summitxgear@gmail.com" className="text-secondary underline underline-offset-4 hover:text-white transition-colors">summitxgear@gmail.com</a></p>
              <p>Alamat: Jl. Raya Banyumas No. 1, Purwokerto, Jawa Tengah, Indonesia</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}
