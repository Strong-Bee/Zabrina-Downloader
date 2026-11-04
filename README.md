# Zabrina Downloader

Aplikasi Next.js untuk memproses tautan media publik dari TikTok, Instagram, Facebook, dan YouTube.

## Arsitektur platform

Empat platform menggunakan satu backend pemrosesan media berbasis yt-dlp yang dijalankan terpisah dari Next.js. Pemisahan ini diperlukan karena ekstraksi media membutuhkan proses dan waktu yang tidak cocok dijalankan langsung di fungsi serverless Vercel.

| Platform | Metadata | Unduhan |
| --- | --- | --- |
| TikTok | Backend media service | Format video/audio yang tersedia |
| Instagram | Backend media service | Foto/video publik yang didukung extractor |
| Facebook | Backend media service | Video publik yang didukung extractor |
| YouTube | Backend media service | Video/audio sesuai format yang tersedia |

**Batasan:** konten privat, konten yang memerlukan login/cookies, konten yang dihapus, dan format yang dibatasi platform tidak dijamin dapat diproses. Tautan CDN dari platform dapat kedaluwarsa; aplikasi meminta tautan baru saat pengguna mengunduh. Audio diunduh dalam format sumber yang tersedia, bukan dikonversi otomatis menjadi MP3.

Gunakan layanan hanya untuk konten yang Anda miliki atau yang Anda berhak unduh. Patuhi ketentuan layanan, hak cipta, dan batasan akses dari setiap platform. Jangan gunakan cookies akun pribadi untuk melewati pembatasan akses.

## Menjalankan Media Service di VPS

Folder `media-service/` berisi service FastAPI + yt-dlp dalam Docker.

1. Salin `media-service/.env.example` menjadi `media-service/.env`.
2. Buat secret acak minimal 32 karakter:

   ```bash
   openssl rand -hex 32
   ```

3. Isi nilai `MEDIA_SERVICE_API_KEY` di `media-service/.env`.
4. Jalankan service:

   ```bash
   cd media-service
   docker compose up -d --build
   docker compose logs -f
   ```

5. Service mendengarkan di `127.0.0.1:8000`. Letakkan di belakang reverse proxy HTTPS (misalnya Nginx) dan batasi akses langsung ke port aplikasi. Endpoint health check:

   ```
   https://media-api.example.com/health
   ```

Jangan membuka port service tanpa HTTPS dan jangan membagikan API key. Service mewajibkan header `X-API-Key`, memvalidasi host platform, dan hanya menerima URL HTTPS dari empat platform yang didukung.

## Environment Variables Next.js / Vercel

Tambahkan dua variabel berikut di Vercel Project Settings → Environment Variables, lalu redeploy:

| Variable | Keterangan |
| --- | --- |
| `MEDIA_SERVICE_URL` | URL HTTPS reverse proxy ke media service, tanpa path `/v1` |
| `MEDIA_SERVICE_API_KEY` | Secret yang sama dengan nilai di VPS |

Contoh `.env.local`:

```env
MEDIA_SERVICE_URL=https://media-api.example.com
MEDIA_SERVICE_API_KEY=isi-secret-yang-sama-dengan-vps
```

Kedua variabel ini hanya digunakan server-side dan tidak memakai prefix `NEXT_PUBLIC_`. Jangan pernah memasukkan API key ke frontend atau repository.

Jika service belum dikonfigurasi atau tidak dapat dijangkau, API Next.js mengembalikan JSON error yang jelas (503/502), bukan halaman HTML yang kemudian gagal diparse sebagai JSON.

## Halaman Support / Donasi

Halaman donasi tersedia di `/support` dan dapat diakses dari menu navigasi serta footer. Metode pembayaran dikonfigurasi melalui environment variables:

| Variable | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SAWERIA_URL` | URL halaman Saweria |
| `NEXT_PUBLIC_TRAKTEER_URL` | URL halaman Trakteer |
| `NEXT_PUBLIC_BUYMEACOFFEE_URL` | URL halaman Buy Me a Coffee |
| `NEXT_PUBLIC_DONATION_QRIS_IMAGE` | URL gambar QRIS yang dikelola pemilik |

Isi hanya metode yang benar-benar dimiliki dan sudah diverifikasi. Jika semua variabel kosong, halaman menampilkan pemberitahuan bahwa metode donasi belum dikonfigurasi.

## Teknologi

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- FastAPI + yt-dlp untuk pemrosesan media
- Docker untuk deployment media service

## Instalasi aplikasi web

```bash
git clone https://github.com/Strong-Bee/Zabrina-Downloader.git
cd Zabrina-Downloader
npm ci
npm run dev
```

Buka http://localhost:3000.

## Pemeriksaan

```bash
npm run lint
npm run typecheck
npm run build
```

## API Next.js

| Endpoint | Fungsi |
| --- | --- |
| `POST /api/{platform}` | Mengambil metadata dari media service |
| `POST /api/{platform}/download` | Meminta URL media untuk kualitas yang dipilih |

Nilai `{platform}`: `tiktok`, `instagram`, `facebook`, atau `youtube`. Setiap endpoint memvalidasi host dan protokol sebelum meneruskan permintaan.

## Lisensi

Periksa file lisensi repository sebelum penggunaan atau distribusi.
