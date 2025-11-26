"use client";

import Link from "next/link";
import Image from "next/image";

export default function ContactThanksPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Illustration */}
            <div className="mb-12 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src="/thanks.png"
                  alt="お問い合わせありがとうございます"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#1D2430] mb-8">
              お問い合わせありがとうございます。
            </h1>

            {/* Body Text */}
            <div className="space-y-4 mb-12 text-gray-900">
              <p className="text-base md:text-lg leading-relaxed">
                お問い合わせ内容については、順次対応させていただきますのでもうしばらくお待ちください。
              </p>
            </div>


            {/* Back to Home Button */}
            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-block bg-[#283D64] text-[#FFFFFF] px-8 py-3 rounded-lg font-semibold hover:bg-[#324a75] transition-colors"
              >
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

