import { getPublishedPortfolios, getPortfolioCategories } from "@/lib/supabase-data";
import Image from "next/image";
import type { Metadata } from "next";
import PortfolioGrid from "./PortfolioGrid";

// ISR: 60秒間キャッシュし、バックグラウンドで再生成
export const revalidate = 60;

export const metadata: Metadata = {
  title: "ポートフォリオ | 株式会社メディア・ワーク",
  description: "株式会社メディア・ワークの制作実績をご紹介します。",
  openGraph: {
    title: "ポートフォリオ | 株式会社メディア・ワーク",
    description: "株式会社メディア・ワークの制作実績をご紹介します。",
    images: ["/ogp-image.png"],
  },
};

export default async function PortfolioPage() {
  const [portfolios, categories] = await Promise.all([getPublishedPortfolios(), getPortfolioCategories()]);

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/video-g07e4aeb6d_640.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>

        <div className="relative z-10 h-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              ポートフォリオ
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-md">
              私たちの制作実績をご覧ください。
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioGrid portfolios={portfolios} categories={categories} />
        </div>
      </section>
    </div>
  );
}
