import Link from "next/link";
import Image from "next/image";
import ScrollToTop from "./ScrollToTop";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center md:justify-start text-center md:text-left">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/logo.ft.png"
                alt="株式会社メディア・ワーク"
                width={200}
                height={80}
                className="h-auto object-contain mx-auto md:mx-0"
                priority
              />
            </Link>
          </div>

          {/* Content Section */}
          <div className="flex-1">
            {/* Upper Section - Navigation Menu */}
            <nav className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
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
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
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

      <ScrollToTop />
    </footer>
  );
}
