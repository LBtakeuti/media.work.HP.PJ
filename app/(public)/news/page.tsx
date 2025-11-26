import { getNews, getNewsCategories } from "@/lib/supabase-data";
import NewsCard from "@/components/NewsCard";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

// キャッシュを無効化し、毎回最新データを取得
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "ニュース | 株式会社メディア・ワーク",
  description: "株式会社メディア・ワークの最新ニュース、お知らせをご紹介します。",
  openGraph: {
    title: "ニュース | 株式会社メディア・ワーク",
    description: "株式会社メディア・ワークの最新ニュース、お知らせをご紹介します。",
    images: ["/logo.jpg"],
  },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allNews = await getNews();
  const categories = await getNewsCategories();
  
  // Filter by category if specified
  const selectedCategory = searchParams.category;
  const newsItems = selectedCategory
    ? allNews.filter(item => item.categories?.includes(selectedCategory))
    : allNews;

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/NEWS-back.avif"
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

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600">カテゴリで絞り込み:</span>
              <Link
                href="/news"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                すべて
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/news?category=${encodeURIComponent(category.name)}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.name
                      ? "text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                  style={selectedCategory === category.name ? { backgroundColor: category.color } : {}}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory && (
            <div className="mb-8">
              <p className="text-gray-600">
                「<span className="font-medium">{selectedCategory}</span>」の記事を表示中
                <Link href="/news" className="ml-2 text-primary-600 hover:underline text-sm">
                  フィルターを解除
                </Link>
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategory 
                    ? `「${selectedCategory}」カテゴリの記事はありません。`
                    : "お知らせはありません。"
                  }
                </p>
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
