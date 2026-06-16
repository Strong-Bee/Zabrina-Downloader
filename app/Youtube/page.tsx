"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaYoutube,
  FaDownload,
  FaCheckCircle,
  FaVideo,
  FaMusic,
  FaPlay,
} from "react-icons/fa";
import { FiClock, FiEye, FiThumbsUp, FiLoader } from "react-icons/fi";

export default function YoutubePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Validasi URL YouTube (Ditambahkan dukungan untuk YouTube Shorts)
  const validateYoutubeUrl = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([\w-]+)/,
      /(?:youtu\.be\/)([\w-]+)/,
      /(?:youtube\.com\/embed\/)([\w-]+)/,
      /(?:youtube\.com\/v\/)([\w-]+)/,
      /(?:youtube\.com\/shorts\/)([\w-]+)/, // Tambahan: support YouTube Shorts
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleFetchVideo = async () => {
    if (!url) {
      setError("Silakan masukkan URL YouTube");
      return;
    }

    // Validasi URL
    if (!validateYoutubeUrl(url)) {
      setError("URL YouTube tidak valid. Pastikan URL benar.");
      return;
    }

    setIsLoading(true);
    setError("");
    setVideoInfo(null);

    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success && data.data) {
        setVideoInfo(data.data);
      } else {
        throw new Error("Data video tidak ditemukan");
      }
    } catch (err) {
      console.error("Error detail:", err);

      // Tampilkan pesan error yang lebih user-friendly
      let errorMessage = "Terjadi kesalahan saat memproses video";

      if (err.message?.includes("Invalid URL")) {
        errorMessage = "URL YouTube tidak valid. Pastikan URL benar.";
      } else if (err.message?.includes("404")) {
        errorMessage =
          "Video tidak ditemukan. Mungkin video telah dihapus atau di-private.";
      } else if (err.message?.includes("network")) {
        errorMessage = "Koneksi internet bermasalah. Periksa koneksi Anda.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (quality, label) => {
    if (!videoInfo) return;

    setDownloading(quality);

    try {
      const response = await fetch("/api/youtube/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          quality: quality,
        }),
      });

      const data = await response.json();

      if (response.ok && data.downloadUrl) {
        // Buka link download di tab baru
        window.open(data.downloadUrl, "_blank");
      } else {
        // Fallback: gunakan link yang sudah ada atau simulasi download
        const downloadUrl = videoInfo.downloadLinks?.[quality];
        if (downloadUrl && downloadUrl !== "#") {
          window.open(downloadUrl, "_blank");
        } else {
          // Simulasi download untuk demo
          alert(
            `🎬 Download ${label} - ${videoInfo.title}\n\nFitur download akan segera aktif.`,
          );
        }
      }
    } catch (err) {
      console.error("Download error:", err);
      alert(`⚠️ Gagal mendownload ${label}. Silakan coba lagi.`);
    } finally {
      setDownloading(null);
    }
  };

  const qualityOptions = [
    { label: "1080p (HD)", size: "45 MB", quality: "hd" },
    { label: "720p (HD)", size: "25 MB", quality: "sd" },
    { label: "480p (SD)", size: "15 MB", quality: "low" },
    { label: "Audio MP3", size: "5 MB", quality: "audio", icon: FaMusic },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaYoutube className="w-5 h-5" />
              <span>YouTube Downloader</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-red-600">Download</span>
              <span className="text-gray-800 dark:text-white">
                {" "}
                Video YouTube
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Download video dan audio dari YouTube dengan kualitas terbaik.
              Support 1080p, 720p, dan MP3.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFetchVideo();
                    }
                  }}
                  placeholder="Tempelkan URL YouTube di sini..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white text-base"
                />
              </div>
              <button
                onClick={handleFetchVideo}
                disabled={isLoading || !url}
                className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:scale-105 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <FaDownload className="w-5 h-5" />
                    Cari Video
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <span className="font-semibold">⚠️ Error:</span> {error}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                Support video panjang
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                Tanpa watermark
              </span>
              <span className="flex items-center gap-1">
                <FaMusic className="w-4 h-4 text-purple-500" />
                Ekstrak audio MP3
              </span>
            </div>
          </div>

          {/* Video Info Preview */}
          {videoInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-video bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      videoInfo.thumbnail ||
                      "https://via.placeholder.com/640x360/1a1a1a/ffffff?text=No+Thumbnail"
                    }
                    alt={videoInfo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const fallback =
                        "https://via.placeholder.com/640x360/1a1a1a/ffffff?text=No+Thumbnail";
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FaPlay className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {videoInfo.duration || "0:00"}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                      {videoInfo.title || "Untitled Video"}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        {videoInfo.views?.toLocaleString() || "0"} views
                      </span>
                      <span className="flex items-center gap-1">
                        <FiThumbsUp className="w-4 h-4" />
                        {videoInfo.likes?.toLocaleString() || "0"} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <FaYoutube className="w-4 h-4 text-red-500" />
                        {videoInfo.channelName || "Unknown Channel"}
                      </span>
                    </div>
                  </div>

                  {/* Quality Options */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pilih Kualitas:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {qualityOptions.map((quality, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleDownload(quality.quality, quality.label)
                          }
                          disabled={downloading === quality.quality}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloading === quality.quality ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              {quality.icon && (
                                <quality.icon className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                {quality.label}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {quality.size}
                              </span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaVideo className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                HD Quality
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download video YouTube dalam kualitas 1080p, 720p, dan 480p.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaMusic className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Audio MP3
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ekstrak audio dari video YouTube dan download dalam format MP3.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Tanpa Watermark
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download video tanpa watermark atau logo apapun. Hasil bersih.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              💡 Tips Download YouTube
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>
                • Pastikan URL YouTube valid (contoh:
                https://youtube.com/watch?v=...)
              </li>
              <li>• Pilih kualitas sesuai kebutuhan untuk menghemat kuota</li>
              <li>
                • Gunakan fitur audio MP3 untuk mendengarkan musik offline
              </li>
              <li>• Video dengan hak cipta mungkin tidak bisa di download</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
