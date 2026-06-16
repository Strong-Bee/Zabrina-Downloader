import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaYoutube,
  FaTiktok,
  FaInstagram,
  FaFacebook,
  FaStar,
} from "react-icons/fa";
import { FiDownload, FiCheckCircle, FiShield, FiZap } from "react-icons/fi";

export default function Home() {
  const platforms = [
    {
      name: "YouTube",
      icon: FaYoutube,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      color: "text-black dark:text-white",
      bg: "bg-gray-50 dark:bg-gray-800",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  const features = [
    {
      icon: FiDownload,
      title: "Unduh Cepat & Mudah",
      description:
        "Download video dan audio dengan sekali klik, proses super cepat tanpa ribet",
    },
    {
      icon: FiCheckCircle,
      title: "Kualitas Terbaik",
      description:
        "Pilih kualitas HD hingga 4K, tanpa watermark dan hasil maksimal",
    },
    {
      icon: FiShield,
      title: "Aman & Terpercaya",
      description:
        "100% bebas virus, malware, dan iklan mengganggu. Privasi Anda terjaga",
    },
    {
      icon: FiZap,
      title: "Multi Platform",
      description:
        "Support download dari YouTube, TikTok, Instagram, dan Facebook",
    },
  ];

  const stats = [
    { number: "1M+", label: "Total Downloads" },
    { number: "4.8", label: "Rating Pengguna" },
    { number: "100K+", label: "Pengguna Aktif" },
    { number: "50+", label: "Negara" },
  ];

  const howToUse = [
    {
      step: "1",
      title: "Salin Link",
      desc: "Salin URL video dari platform yang diinginkan",
    },
    {
      step: "2",
      title: "Tempel Link",
      desc: "Tempelkan link di kolom yang tersedia",
    },
    {
      step: "3",
      title: "Download",
      desc: "Klik download dan pilih kualitas yang diinginkan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaStar className="w-4 h-4" />
              <span>#1 Downloader Video Terbaik 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                Zabrina Downloader
              </span>
              <br />
              <span className="text-gray-800 dark:text-white">
                Solusi Download Video
              </span>
              <br />
              <span className="text-gray-600 dark:text-gray-300 text-3xl sm:text-4xl lg:text-5xl">
                Tanpa Batas
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Download video dan audio dari YouTube, TikTok, Instagram, dan
              Facebook dengan kualitas HD, cepat, dan gratis sepenuhnya.
            </p>

            {/* Input URL Section */}
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 mb-8 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tempelkan URL video di sini..."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:text-white text-base"
                  />
                </div>
                <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg transition hover:scale-105 flex items-center justify-center gap-2 text-base">
                  <FiDownload className="w-5 h-5" />
                  Download
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-left">
                Support: YouTube, TikTok, Instagram, Facebook • Maksimal 100MB
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Icons */}
            <div
              id="platforms"
              className="flex justify-center gap-4 flex-wrap mb-16"
            >
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`w-20 h-20 ${platform.bg} rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition transform border-2 border-transparent group-hover:border-violet-400`}
                  >
                    <platform.icon className={`w-10 h-10 ${platform.color}`} />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>

            {/* How to Use */}
            <div id="howto" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                Cara Menggunakan
                <span className="block text-base font-normal text-gray-500 dark:text-gray-400 mt-2">
                  Hanya 3 langkah mudah untuk download video favorit Anda
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {howToUse.map((item) => (
                  <div
                    key={item.step}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div
              id="features"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-200/50 dark:border-gray-700/50 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                      <feature.icon className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800 dark:text-white">
                      Andi Pratama
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Pengguna Zabrina Downloader
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-left italic">
                  "Zabrina Downloader sangat membantu saya untuk mengunduh video
                  pembelajaran dari YouTube. Kualitasnya jernih dan prosesnya
                  cepat. Recommended!"
                </p>
                <div className="flex text-yellow-400 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
