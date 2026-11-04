"use client";

import { useState } from "react";
import { MdDownload } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { FaYoutube, FaTiktok, FaInstagram, FaFacebook, FaHeart } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "YouTube", href: "/Youtube", icon: FaYoutube },
    { name: "TikTok", href: "/Tiktok", icon: FaTiktok },
    { name: "Instagram", href: "/Instagram", icon: FaInstagram },
    { name: "Facebook", href: "/Facebook", icon: FaFacebook },
    { name: "Support", href: "/support", icon: FaHeart },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center">
              <MdDownload className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Zabrina</span>
              <span className="text-gray-800 dark:text-white">Downloader</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={link.name === "Support"
                  ? "flex items-center gap-2 text-white bg-gradient-to-r from-pink-600 to-violet-600 hover:shadow-lg transition font-semibold px-4 py-2 rounded-lg"
                  : "flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition font-medium px-3 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={link.name === "Support"
                    ? "flex items-center gap-3 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 font-semibold px-3 py-2 rounded-lg"
                    : "flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition font-medium px-3 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
