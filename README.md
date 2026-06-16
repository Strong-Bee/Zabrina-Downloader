# 🎬 Zabrina Downloader

<div align="center">

![Zabrina Downloader](https://img.shields.io/badge/Zabrina-Downloader-8B5CF6?style=for-the-badge&logo=next.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.0.0-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=flat-square&logo=typescript&logoColor=white)

**Download video dan audio dari YouTube, TikTok, Instagram, dan Facebook dengan mudah, cepat, dan gratis.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](#)
[![Report Bug](https://img.shields.io/badge/Report_Bug-F97316?style=for-the-badge&logo=github&logoColor=white)](#)
[![Request Feature](https://img.shields.io/badge/Request_Feature-10B981?style=for-the-badge&logo=github&logoColor=white)](#)

</div>

---

## 📋 Daftar Isi

- [✨ Fitur](#-fitur)
- [📱 Platform yang Didukung](#-platform-yang-didukung)
- [🚀 Teknologi](#-teknologi)
- [📦 Instalasi](#-instalasi)
- [💻 Penggunaan](#-penggunaan)
- [📁 Struktur Proyek](#-struktur-proyek)
- [🛠️ API Endpoints](#️-api-endpoints)
- [🤝 Kontribusi](#-kontribusi)
- [📄 Lisensi](#-lisensi)

---

## ✨ Fitur

- ✅ **Multi Platform** - Download dari YouTube, TikTok, Instagram, dan Facebook
- 🎥 **Kualitas HD** - Support resolusi 1080p, 720p, dan 480p
- 🎵 **Ekstrak Audio** - Download audio MP3 dari video
- 🚫 **Tanpa Watermark** - Download video tanpa watermark (khusus TikTok)
- ⚡ **Cepat & Gratis** - Proses download super cepat tanpa biaya
- 🔒 **Aman** - 100% bebas virus dan malware
- 🌓 **Dark Mode** - Mendukung tema gelap dan terang
- 📱 **Responsive** - Tampilan optimal di semua perangkat

---

## 📱 Platform yang Didukung

| Platform                                                                                                     | Status | Fitur                      |
| ------------------------------------------------------------------------------------------------------------ | ------ | -------------------------- |
| ![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=flat-square&logo=youtube&logoColor=white)       | ✅     | Video HD, Audio MP3        |
| ![TikTok](https://img.shields.io/badge/TikTok-000000?style=flat-square&logo=tiktok&logoColor=white)          | ✅     | Tanpa Watermark, Audio MP3 |
| ![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat-square&logo=instagram&logoColor=white) | ✅     | Video, Foto, Reels         |
| ![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=flat-square&logo=facebook&logoColor=white)    | ✅     | Video HD & SD              |

---

## 🚀 Teknologi

- **[Next.js 15](https://nextjs.org/)** - React framework dengan SSR & SSG
- **[React 18](https://reactjs.org/)** - Library UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript dengan type safety
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library
- **[ytdl-core](https://github.com/fent/node-ytdl-core)** - YouTube downloader
- **[Turbopack](https://turbo.build/pack)** - Build tool (Next.js 15+)

---

## 📦 Instalasi

### Prasyarat

- Node.js 18.17.0 atau lebih baru
- npm, yarn, atau pnpm

### Langkah-langkah

1. **Clone repository**

```bash
git clone https://github.com/yourusername/zabrina-downloader.git
cd zabrina-downloader
```

````

2. **Install dependencies**

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Jalankan development server**

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

4. **Buka browser**

Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

---

## 💻 Penggunaan

1. **Pilih Platform** - Klik salah satu menu: YouTube, TikTok, Instagram, atau Facebook
2. **Tempel URL** - Salin dan tempelkan URL video yang ingin di-download
3. **Cari Video** - Klik tombol "Cari Video" untuk mendapatkan informasi video
4. **Pilih Kualitas** - Pilih kualitas video atau audio yang diinginkan
5. **Download** - Klik tombol download untuk mulai mengunduh

### Contoh URL

- **YouTube**: `https://youtube.com/watch?v=xxxxxxxxxxx`
- **TikTok**: `https://www.tiktok.com/@username/video/1234567890`
- **Instagram**: `https://www.instagram.com/p/xxxxxxxxxx/`
- **Facebook**: `https://www.facebook.com/watch/?v=1234567890`

---

## 📁 Struktur Proyek

```
zabrina-downloader/
├── app/
│   ├── api/
│   │   ├── youtube/
│   │   │   ├── route.ts
│   │   │   └── download/
│   │   │       └── route.ts
│   │   ├── tiktok/
│   │   │   ├── route.ts
│   │   │   └── download/
│   │   │       └── route.ts
│   │   ├── instagram/
│   │   │   ├── route.ts
│   │   │   └── download/
│   │   │       └── route.ts
│   │   └── facebook/
│   │       ├── route.ts
│   │       └── download/
│   │           └── route.ts
│   ├── youtube/
│   │   └── page.tsx
│   ├── tiktok/
│   │   └── page.tsx
│   ├── instagram/
│   │   └── page.tsx
│   ├── facebook/
│   │   └── page.tsx
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 🛠️ API Endpoints

### YouTube

| Method | Endpoint                | Deskripsi                                  |
| ------ | ----------------------- | ------------------------------------------ |
| POST   | `/api/youtube`          | Mendapatkan informasi video                |
| POST   | `/api/youtube/download` | Mendownload video dengan kualitas tertentu |

### TikTok

| Method | Endpoint               | Deskripsi                      |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/api/tiktok`          | Mendapatkan informasi video    |
| POST   | `/api/tiktok/download` | Mendownload video/audio TikTok |

### Instagram

| Method | Endpoint                  | Deskripsi                   |
| ------ | ------------------------- | --------------------------- |
| POST   | `/api/instagram`          | Mendapatkan informasi media |
| POST   | `/api/instagram/download` | Mendownload media Instagram |

### Facebook

| Method | Endpoint                 | Deskripsi                   |
| ------ | ------------------------ | --------------------------- |
| POST   | `/api/facebook`          | Mendapatkan informasi video |
| POST   | `/api/facebook/download` | Mendownload video Facebook  |

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Berikut cara untuk berkontribusi:

1. **Fork** repository ini
2. **Buat branch** fitur baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Buat Pull Request**

### Panduan Kontribusi

- Gunakan TypeScript untuk semua kode baru
- Ikuti style guide yang sudah ada
- Tambahkan komentar untuk kode yang kompleks
- Update README.md jika diperlukan
- Pastikan semua test berjalan dengan baik

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

---

## 👏 Kredit

- Dibangun dengan [Next.js](https://nextjs.org/)
- Ikon oleh [React Icons](https://react-icons.github.io/react-icons/)
- Font oleh [Geist](https://vercel.com/font)

---

<div align="center">

**Dibuat dengan ❤️ oleh [Zabrina Team](https://github.com/yourusername)**

</div>
````
#   Z a b r i n a - D o w n l o a d e r  
 