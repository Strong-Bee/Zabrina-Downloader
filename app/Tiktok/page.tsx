"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaTiktok,
  FaDownload,
  FaCheckCircle,
  FaVideo,
  FaMusic,
  FaPlay,
  FaHeart,
  FaComment,
  FaShare,
} from "react-icons/fa";
import { FiClock, FiLoader, FiEye } from "react-icons/fi";

export default function TiktokPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateTiktokUrl = (url) => {
    const patterns = [
      /(?:tiktok\.com\/@)([\w.-]+)\/video\/(\d+)/,
      /(?:tiktok\.com\/@)([\w.-]+)\/v\/(\d+)/,
      /(?:vt\.tiktok\.com\/)([\w]+)/,
      /(?:vm\.tiktok\.com\/)([\w]+)/, // Tambahan: support vm.tiktok.com
      /(?:tiktok\.com\/t\/)([\w]+)/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleFetchVideo = async () => {
    if (!url) {
      setError("Silakan masukkan URL TikTok");
      return;
    }

    if (!validateTiktokUrl(url)) {
      setError("URL TikTok tidak valid. Pastikan URL benar.");
      return;
    }

    setIsLoading(true);
    setError("");
    setVideoInfo(null);

    try {
      const response = await fetch("/api/tiktok", {
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

      let errorMessage = "Terjadi kesalahan saat memproses video";

      if (err.message?.includes("Invalid URL")) {
        errorMessage = "URL TikTok tidak valid. Pastikan URL benar.";
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

  const handleDownload = async (type, label) => {
    if (!videoInfo) return;

    setDownloading(type);

    try {
      const response = await fetch("/api/tiktok/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          type: type,
        }),
      });

      const data = await response.json();

      if (response.ok && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        const downloadUrl = videoInfo.downloadLinks?.[type];
        if (downloadUrl && downloadUrl !== "#") {
          window.open(downloadUrl, "_blank");
        } else {
          alert(
            `🎬 Download ${label} - ${videoInfo.title || "Video TikTok"}\n\nFitur download akan segera aktif.`,
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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
              <FaTiktok className="w-5 h-5" />
              <span>TikTok Downloader</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Download</span>
              <span className="text-[#00f2ea]"> TikTok</span>
              <span className="text-white"> Video</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Download video TikTok tanpa watermark dengan kualitas HD. Cepat,
              gratis, dan mudah.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/10">
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
                  placeholder="Tempelkan URL TikTok di sini..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00f2ea] focus:border-transparent text-white text-base placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleFetchVideo}
                disabled={isLoading || !url}
                className="bg-gradient-to-r from-[#00f2ea] to-[#ff0050] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:scale-105 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
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
              <div className="mt-3 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <span className="font-semibold">⚠️ Error:</span> {error}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                Support semua video
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4 text-[#00f2ea]" />
                Tanpa watermark
              </span>
              <span className="flex items-center gap-1">
                <FaMusic className="w-4 h-4 text-[#ff0050]" />
                Ekstrak audio
              </span>
            </div>
          </div>

          {/* Video Preview - TikTok Style */}
          {videoInfo && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-8 border border-white/10">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Video Preview */}
                <div className="relative aspect-[9/16] max-h-[450px] bg-black flex items-center justify-center">
                  <img
                    src={
                      videoInfo.thumbnail ||
                      "https://via.placeholder.com/400x600/1a1a1a/ffffff?text=No+Thumbnail"
                    }
                    alt={videoInfo.title || "TikTok Video"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const fallback =
                        "https://via.placeholder.com/400x600/1a1a1a/ffffff?text=No+Thumbnail";
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FaPlay className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {videoInfo.duration ? `${videoInfo.duration}s` : "0:00"}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                      {videoInfo.title ||
                        videoInfo.description ||
                        "Video TikTok"}
                    </h3>

                    {/* Author Info */}
                    {videoInfo.author && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                        <img
                          src={
                            videoInfo.author.avatar ||
                            "https://via.placeholder.com/40"
                          }
                          alt={videoInfo.author.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#00f2ea]/30"
                          onError={(e) => {
                            const fallback = "https://via.placeholder.com/40";
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div>
                          <div className="text-white font-medium">
                            @{videoInfo.author.username || "username_tiktok"}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {videoInfo.author.nickname || "User TikTok"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                      <span className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        {(videoInfo.views || 0).toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart className="w-4 h-4 text-[#ff0050]" />
                        {(videoInfo.likes || 0).toLocaleString()} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <FaComment className="w-4 h-4 text-[#00f2ea]" />
                        {(videoInfo.comments || 0).toLocaleString()} comments
                      </span>
                    </div>
                  </div>

                  {/* Download Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() =>
                        handleDownload(
                          "videoNoWatermark",
                          "Video (Tanpa Watermark)",
                        )
                      }
                      disabled={downloading === "videoNoWatermark"}
                      className="w-full bg-gradient-to-r from-[#00f2ea] to-[#ff0050] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading === "videoNoWatermark" ? (
                        <>
                          <FiLoader className="w-5 h-5 animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <FaDownload className="w-5 h-5" />
                          Download Video (Tanpa Watermark)
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload("audio", "Audio MP3")}
                      disabled={downloading === "audio"}
                      className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading === "audio" ? (
                        <>
                          <FiLoader className="w-5 h-5 animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <FaMusic className="w-5 h-5" />
                          Download Audio MP3
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition">
              <div className="w-12 h-12 bg-[#00f2ea]/20 rounded-xl flex items-center justify-center mb-4">
                <FaVideo className="w-6 h-6 text-[#00f2ea]" />
              </div>
              <h3 className="font-semibold text-white mb-2">Tanpa Watermark</h3>
              <p className="text-sm text-gray-300">
                Download video TikTok tanpa watermark atau logo apapun.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition">
              <div className="w-12 h-12 bg-[#ff0050]/20 rounded-xl flex items-center justify-center mb-4">
                <FaMusic className="w-6 h-6 text-[#ff0050]" />
              </div>
              <h3 className="font-semibold text-white mb-2">Audio MP3</h3>
              <p className="text-sm text-gray-300">
                Ekstrak audio dari video TikTok dan download sebagai MP3.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <FaShare className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Cepat & Gratis</h3>
              <p className="text-sm text-gray-300">
                Proses download super cepat dan gratis tanpa batasan.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
            <h4 className="font-semibold text-blue-400 mb-2">
              💡 Tips Download TikTok
            </h4>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Salin URL dari video TikTok yang ingin di download</li>
              <li>• Pilih kualitas video atau audio sesuai kebutuhan</li>
              <li>• Video akan terdownload tanpa watermark</li>
              <li>• Pastikan video tidak di-private atau dihapus</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
