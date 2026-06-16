"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaInstagram,
  FaDownload,
  FaCheckCircle,
  FaVideo,
  FaImage,
  FaPlay,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import { FiClock, FiLoader, FiEye } from "react-icons/fi";

export default function InstagramPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaInfo, setMediaInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleFetchMedia = async () => {
    if (!url) {
      setError("Silakan masukkan URL Instagram");
      return;
    }

    setIsLoading(true);
    setError("");
    setMediaInfo(null);

    try {
      const response = await fetch("/api/instagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendapatkan media");
      }

      if (data.success && data.data) {
        setMediaInfo(data.data);
      } else {
        throw new Error("Data media tidak ditemukan");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memproses media");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!mediaInfo) return;

    setDownloading(true);

    try {
      const response = await fetch("/api/instagram/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      const data = await response.json();

      if (response.ok && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        // Fallback
        const downloadUrl =
          mediaInfo.downloadLinks?.hd || mediaInfo.downloadLinks?.sd;
        if (downloadUrl) {
          window.open(downloadUrl, "_blank");
        } else {
          alert(
            `Download ${mediaInfo.type === "video" ? "Video" : "Foto"} - Instagram`,
          );
        }
      }
    } catch (err) {
      console.error("Download error:", err);
      alert(
        `Download ${mediaInfo.type === "video" ? "Video" : "Foto"} - Instagram`,
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaInstagram className="w-5 h-5" />
              <span>Instagram Downloader</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Download Instagram
              </span>
              <span className="text-gray-800 dark:text-white"> Content</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Download video, foto, dan reels dari Instagram dengan mudah dan
              cepat.
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
                  placeholder="Tempelkan URL Instagram di sini..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:text-white text-base"
                />
              </div>
              <button
                onClick={handleFetchMedia}
                disabled={isLoading || !url}
                className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:scale-105 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <FaDownload className="w-5 h-5" />
                    Cari Media
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FaImage className="w-4 h-4 text-pink-500" />
                Support foto & video
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                Kualitas HD
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                Download reels
              </span>
            </div>
          </div>

          {/* Media Preview */}
          {mediaInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-square bg-gray-900">
                  <img
                    src={
                      mediaInfo.thumbnail ||
                      "https://via.placeholder.com/600x600"
                    }
                    alt="Instagram media"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x600";
                    }}
                  />
                  {mediaInfo.type === "video" && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <FaPlay className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {mediaInfo.duration || "0:30"}
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-sm font-medium">
                        {mediaInfo.type === "video" ? "Video" : "Foto"}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Instagram
                      </span>
                    </div>

                    {/* Author Info */}
                    {mediaInfo.author && (
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={
                            mediaInfo.author.avatar ||
                            "https://via.placeholder.com/40"
                          }
                          alt={mediaInfo.author.username}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {mediaInfo.author.fullName ||
                              mediaInfo.author.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{mediaInfo.author.username}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FaHeart className="w-4 h-4 text-pink-500" />
                        {mediaInfo.likes?.toLocaleString() || "0"} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <FaComment className="w-4 h-4 text-blue-500" />
                        {mediaInfo.comments?.toLocaleString() || "0"} comments
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <FaDownload className="w-4 h-4" />
                          Download{" "}
                          {mediaInfo.type === "video" ? "Video" : "Foto"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaVideo className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Download Reels
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download Instagram Reels dengan kualitas HD dan tanpa watermark.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaImage className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Download Foto
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download foto Instagram dalam resolusi tinggi dan kualitas
                terbaik.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                <FiClock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Cepat & Mudah
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Proses download cepat dengan interface yang user-friendly.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">
              💡 Tips Download Instagram
            </h4>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Salin URL dari post, reel, atau story Instagram</li>
              <li>• Support untuk post public dan private (jika diizinkan)</li>
              <li>• Download dalam resolusi asli untuk hasil terbaik</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
