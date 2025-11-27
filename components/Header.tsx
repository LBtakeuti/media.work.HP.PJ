"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-[100] border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center md:justify-between items-center h-[80px]">
          <div className="flex-shrink-0">
            <Link href="/" className="block group">
              <Image
                src="/logo.jpg"
                alt="コーポレートサイト"
                width={250}
                height={80}
                className="h-16 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
                priority
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/news"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-bold transition-colors"
            >
              NEWS
            </Link>
            <Link
              href="/company"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-bold transition-colors"
            >
              COMPANY
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-bold transition-colors"
            >
              SERVICES
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-bold transition-colors"
            >
              PORTFOLIO
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-bold transition-colors"
            >
              CONTACT
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden absolute right-0 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-[100] ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/news"
                className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                NEWS
              </Link>
              <Link
                href="/company"
                className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                COMPANY
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                SERVICES
              </Link>
              <Link
                href="/portfolio"
                className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                PORTFOLIO
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

