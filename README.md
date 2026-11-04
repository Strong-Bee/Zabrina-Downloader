# Zabrina Downloader

Aplikasi Next.js untuk mengambil metadata dan menyiapkan tautan unduhan media dari URL publik yang didukung.

## Status platform

| Platform | Status API | Catatan |
| --- | --- | --- |
| YouTube | Eksperimental | Menggunakan `ytdl-core`; kompatibilitas dapat berubah mengikuti perubahan YouTube. |
| TikTok | Eksperimental | Menggunakan `@mrnima/tiktok-downloader`; hanya URL publik yang didukung library. |
| Instagram | Belum tersedia | Endpoint mengembalikan HTTP 501 sampai adapter resmi/tepercaya dikonfigurasi. |
| Facebook | Belum tersedia | Endpoint mengembalikan HTTP 501 sampai adapter resmi/tepercaya dikonfigurasi. |

Aplikasi tidak mengklaim metadata atau tautan unduhan palsu sebagai hasil nyata. Gunakan hanya untuk konten yang Anda miliki atau yang memang Anda berhak unduh, dan patuhi ketentuan layanan setiap platform.

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
npm run build
```

## API

Semua endpoint menerima JSON melalui `POST`.

| Endpoint | Fungsi |
| --- | --- |
| `/api/youtube` | Mengambil metadata YouTube |
| `/api/youtube/download` | Memilih format unduhan YouTube |
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
