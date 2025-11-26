import { getNews } from "@/lib/supabase-data";
import NewsCard from "@/components/NewsCard";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ニュース | 株式会社メディア・ワーク",
  description: "株式会社メディア・ワークの最新ニュース、お知らせをご紹介します。",
  openGraph: {
    title: "ニュース | 株式会社メディア・ワーク",
    description: "株式会社メディア・ワークの最新ニュース、お知らせをご紹介します。",
    images: ["/logo.jpg"],
  },
};

export default async function NewsPage() {
  const newsItems = await getNews();

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/photo-1641384687356-02f2cdd30ed5.avif"
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
              ニュース
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-md">
              最新のお知らせや情報をお届けします。
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">お知らせはありません。</p>
              </div>
            ) : (
              newsItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

