"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Logo Section - Left Side */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/logo.ft.png"
                alt="株式会社メディア・ワーク"
                width={200}
                height={80}
                className="h-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Content Section - Right Side */}
          <div className="flex-1">
            {/* Upper Section - Navigation Menu */}
            <nav className="flex flex-wrap gap-8 mb-6">
              <Link href="/news" className="text-white hover:text-gray-300 transition-colors text-sm font-bold">
                NEWS
              </Link>
              <Link href="/company" className="text-white hover:text-gray-300 transition-colors text-sm font-bold">
                COMPANY
              </Link>
              <Link href="/services" className="text-white hover:text-gray-300 transition-colors text-sm font-bold">
                SERVICES
              </Link>
              <Link href="/portfolio" className="text-white hover:text-gray-300 transition-colors text-sm font-bold">
                PORTFOLIO
              </Link>
              <Link href="/contact" className="text-white hover:text-gray-300 transition-colors text-sm font-bold">
                CONTACT
              </Link>
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-700 mb-6"></div>

            {/* Lower Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white text-sm">
                &copy; {new Date().getFullYear()} 株式会社メディア・ワーク. All rights reserved.
              </p>
              <Link href="/privacy" className="text-white hover:text-gray-300 transition-colors text-sm">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-50"
          aria-label="ページトップへ戻る"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </footer>
  );
}
