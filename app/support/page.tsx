"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaHeart, FaCoffee, FaQrcode, FaExternalLinkAlt } from "react-icons/fa";

const donationOptions = [
  {
    name: "Saweria",
    description: "Dukung pengembangan Zabrina Downloader melalui Saweria.",
    href: process.env.NEXT_PUBLIC_SAWERIA_URL,
    icon: FaHeart,
    accent: "from-orange-500 to-amber-500",
  },
  {
    name: "Trakteer",
    description: "Berikan dukungan sekali klik melalui Trakteer.",
    href: process.env.NEXT_PUBLIC_TRAKTEER_URL,
    icon: FaCoffee,
    accent: "from-pink-500 to-rose-500",
  },
  {
    name: "Buy Me a Coffee",
    description: "Traktir kopi untuk membantu biaya server dan pengembangan.",
    href: process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL,
    icon: FaCoffee,
    accent: "from-yellow-500 to-orange-500",
  },
].filter((option) => Boolean(option.href));

const qrisImage = process.env.NEXT_PUBLIC_DONATION_QRIS_IMAGE;

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-4 py-2 text-sm font-semibold mb-5">
              <FaHeart /> Support Zabrina Downloader
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Dukung pengembangan <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Zabrina Downloader</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Jika aplikasi ini bermanfaat, dukungan sukarela Anda membantu biaya server,
              pemeliharaan, dan pengembangan fitur baru. Donasi sepenuhnya opsional.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pilih metode dukungan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Gunakan salah satu metode yang tersedia di bawah ini.
            </p>

            {donationOptions.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {donationOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-violet-400 hover:shadow-lg transition"
                  >
                    <span className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${option.accent} flex items-center justify-center text-white`}>
                      <option.icon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900 dark:text-white">{option.name}</span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">{option.description}</span>
                    </span>
                    <FaExternalLinkAlt className="shrink-0 text-gray-400 group-hover:text-violet-500" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-violet-300 dark:border-violet-700 bg-violet-50/70 dark:bg-violet-900/10 p-6 text-center">
                <FaHeart className="mx-auto text-3xl text-violet-500 mb-3" />
                <p className="font-semibold text-gray-800 dark:text-white mb-1">Metode donasi segera tersedia</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pengelola belum mengatur tautan donasi. Silakan kunjungi kembali nanti.
                </p>
              </div>
            )}
          </section>

          {qrisImage && (
            <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center mb-8">
              <FaQrcode className="mx-auto text-2xl text-violet-500 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Donasi melalui QRIS</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Pindai kode QR berikut menggunakan aplikasi pembayaran Anda.</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrisImage} alt="Kode QRIS donasi Zabrina Downloader" className="mx-auto max-h-80 w-auto rounded-xl object-contain" />
            </section>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Terima kasih telah menggunakan dan mendukung Zabrina Downloader. Jangan pernah mengirimkan PIN,
            kata sandi, atau kode OTP saat berdonasi.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
