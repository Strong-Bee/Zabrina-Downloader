"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaFacebook,
  FaDownload,
  FaCheckCircle,
  FaVideo,
  FaPlay,
  FaHeart,
  FaComment,
  FaShare,
} from "react-icons/fa";
import { FiClock, FiLoader, FiEye } from "react-icons/fi";

export default function FacebookPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);

  const handleFetchVideo = async () => {
    if (!url) {
      setError("Silakan masukkan URL Facebook");
      return;
    }

    setIsLoading(true);
    setError("");
    setVideoInfo(null);

    try {
      const response = await fetch("/api/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendapatkan video");
      }

      if (data.success && data.data) {
        setVideoInfo(data.data);
      } else {
        throw new Error("Data video tidak ditemukan");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memproses video");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (quality, label) => {
    if (!videoInfo) return;

    setDownloading(quality);

    try {
      const response = await fetch("/api/facebook/download", {
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
        window.open(data.downloadUrl, "_blank");
      } else {
        const downloadUrl = videoInfo.downloadLinks?.[quality];
        if (downloadUrl) {
          window.open(downloadUrl, "_blank");
        } else {
          alert(`Download ${label} - ${videoInfo.title}`);
        }
      }
    } catch (err) {
      console.error("Download error:", err);
      alert(`Download ${label} - ${videoInfo.title}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaFacebook className="w-5 h-5" />
              <span>Facebook Downloader</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-blue-600">Download</span>
              <span className="text-gray-800 dark:text-white"> Facebook</span>
              <span className="text-blue-600"> Video</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Download video dari Facebook dengan kualitas HD. Support video
              public dan private.
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
                  placeholder="Tempelkan URL Facebook di sini..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-base"
                />
              </div>
              <button
                onClick={handleFetchVideo}
                disabled={isLoading || !url}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:scale-105 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
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
              <div className="mt-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                Support video panjang
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                Kualitas HD
              </span>
              <span className="flex items-center gap-1">
                <FaVideo className="w-4 h-4 text-blue-500" />
                Video & Live
              </span>
            </div>
          </div>

          {/* Video Preview */}
          {videoInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={
                      videoInfo.thumbnail ||
                      "https://via.placeholder.com/640x360"
                    }
                    alt={videoInfo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/640x360";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-600/80 rounded-full flex items-center justify-center">
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
                      {videoInfo.title ||
                        videoInfo.description ||
                        "Video Facebook"}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        {videoInfo.views?.toLocaleString() || "0"} views
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart className="w-4 h-4 text-red-500" />
                        {videoInfo.likes?.toLocaleString() || "0"} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <FaComment className="w-4 h-4 text-blue-500" />
                        {videoInfo.comments?.toLocaleString() || "0"} comments
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleDownload("hd", "Video HD")}
                      disabled={downloading === "hd"}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading === "hd" ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <FaDownload className="w-4 h-4" />
                          Download Video (HD)
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload("sd", "Video SD")}
                      disabled={downloading === "sd"}
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading === "sd" ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <FaDownload className="w-4 h-4" />
                          Download Video (SD)
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
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaVideo className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                HD Quality
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download video Facebook dalam kualitas HD 1080p dan 720p.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaCheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Tanpa Watermark
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download video tanpa watermark atau logo apapun.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <FaShare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Support Semua
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Support video Facebook, live streaming, dan video dari group.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-400 mb-2">
              💡 Tips Download Facebook
            </h4>
            <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
              <li>• Salin URL dari video Facebook yang ingin di download</li>
              <li>• Support video dari postingan, group, dan halaman</li>
              <li>• Pilih kualitas HD untuk hasil terbaik</li>
              <li>• Video live streaming juga dapat didownload</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
