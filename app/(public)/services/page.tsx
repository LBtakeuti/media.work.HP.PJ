import Image from "next/image";
import { getServices, getServiceCategories } from "@/lib/supabase-data";
import type { Metadata } from "next";
import ServicesGrid from "./ServicesGrid";

// ISR: 60秒間キャッシュし、バックグラウンドで再生成
export const revalidate = 60;

export const metadata: Metadata = {
  title: "サービス | 株式会社メディア・ワーク",
  description: "株式会社メディア・ワークが提供するサービスをご紹介します。",
  openGraph: {
    title: "サービス | 株式会社メディア・ワーク",
    description: "株式会社メディア・ワークが提供するサービスをご紹介します。",
    images: ["/ogp-image.png"],
  },
};

export default async function ServicesPage() {
  const [allServices, categories] = await Promise.all([getServices(), getServiceCategories()]);

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/mediawrok.service.png"
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/20 z-[1]"></div>

        <div className="relative z-10 h-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              事業案内
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-md">
              お客様のビジネスをサポートする多様なサービスを提供しています。
            </p>
          </div>
        </div>
      </section>

      <ServicesGrid services={allServices} categories={categories} />
    </div>
  );
}
