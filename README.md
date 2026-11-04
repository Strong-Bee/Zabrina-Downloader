# Zabrina Downloader

Aplikasi Next.js untuk mengambil metadata dari URL publik yang didukung dan menampilkan opsi dukungan sukarela.

## Status platform

| Platform | Status API | Catatan |
| --- | --- | --- |
| YouTube | Metadata tersedia via oEmbed | Durasi, views, likes, dan unduhan belum disediakan oleh oEmbed. |
| TikTok | Eksperimental | Menggunakan `@mrnima/tiktok-downloader`; hanya URL publik yang didukung library. |
| Instagram | Belum tersedia | Endpoint mengembalikan HTTP 501 sampai adapter resmi/tepercaya dikonfigurasi. |
| Facebook | Belum tersedia | Endpoint mengembalikan HTTP 501 sampai adapter resmi/tepercaya dikonfigurasi. |

Aplikasi tidak mengklaim metadata atau tautan unduhan palsu sebagai hasil nyata. Gunakan hanya untuk konten yang Anda miliki atau yang memang Anda berhak unduh, dan patuhi ketentuan layanan setiap platform.

## Halaman Support / Donasi

Halaman donasi tersedia di `/support` dan dapat diakses dari menu navigasi serta footer. Metode pembayaran dikonfigurasi melalui environment variables berikut:

| Variable | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SAWERIA_URL` | URL halaman Saweria |
| `NEXT_PUBLIC_TRAKTEER_URL` | URL halaman Trakteer |
| `NEXT_PUBLIC_BUYMEACOFFEE_URL` | URL halaman Buy Me a Coffee |
| `NEXT_PUBLIC_DONATION_QRIS_IMAGE` | URL gambar QRIS yang dikelola pemilik |

Isi hanya metode yang benar-benar dimiliki dan sudah diverifikasi. Jika semua variabel kosong, halaman akan menampilkan pemberitahuan bahwa metode donasi belum dikonfigurasi. Setelah mengatur environment variables di Vercel, lakukan redeploy agar perubahan tampil.

Contoh lokal di `.env.local`:

```env
NEXT_PUBLIC_SAWERIA_URL=
NEXT_PUBLIC_TRAKTEER_URL=
NEXT_PUBLIC_BUYMEACOFFEE_URL=
NEXT_PUBLIC_DONATION_QRIS_IMAGE=
```

Jangan memasukkan nomor rekening, kredensial, PIN, atau OTP ke source code publik.

## Teknologi

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Icons

## Persyaratan

- Node.js 22 atau versi LTS yang kompatibel
- npm

## Instalasi

```bash
git clone https://github.com/Strong-Bee/Zabrina-Downloader.git
cd Zabrina-Downloader
npm ci
```

## Menjalankan aplikasi

```bash
npm run dev
```

Buka http://localhost:3000.

## Pemeriksaan

```bash
npm run lint
npm run typecheck
npm run build
```

## API

| Endpoint | Fungsi |
| --- | --- |
| `/api/youtube` | Mengambil metadata publik via YouTube oEmbed |
| `/api/youtube/download` | Menyiapkan format unduhan YouTube (masih eksperimental) |
| `/api/tiktok` | Mengambil metadata TikTok |
| `/api/tiktok/download` | Menyiapkan tautan unduhan TikTok |
| `/api/instagram` | Mengembalikan 501 sampai adapter tersedia |
| `/api/instagram/download` | Mengembalikan 501 sampai adapter tersedia |
| `/api/facebook` | Mengembalikan 501 sampai adapter tersedia |
| `/api/facebook/download` | Mengembalikan 501 sampai adapter tersedia |

Setiap endpoint memvalidasi host URL terhadap platform yang sesuai. URL ke host lain, protokol selain HTTP(S), kredensial URL, port khusus, dan input terlalu panjang ditolak.

## Catatan operasional

- Jalankan aplikasi di lingkungan Node.js; route downloader menggunakan dependensi Node.
- Pasang rate limiting di reverse proxy atau platform hosting sebelum membuka API ke publik.
- Jangan menambahkan cookie, token akun, atau kredensial platform ke repository.
- Downloader pihak ketiga dapat berhenti bekerja ketika platform sumber mengubah API atau mekanisme aksesnya.

## Lisensi

Periksa file lisensi repository sebelum penggunaan atau distribusi.
