import Link from "next/link";
import { getNewsForList } from "@/lib/supabase-data";
import SmallNewsCard from "@/components/SmallNewsCard";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";

export default async function HomeNews() {
  const newsItems = await getNewsForList();
  const latestNews = newsItems.slice(0, 4);

  return (
    <section className="pt-8 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <AnimatedSectionTitle className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">
            ニュース<span className="text-xl md:text-2xl font-normal ml-2">/NEWS</span>
          </AnimatedSectionTitle>
          <Link
            href="/news"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
          >
            もっと見る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestNews.map((item) => (
            <SmallNewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ローディング用スケルトン
export function HomeNewsSkeleton() {
  return (
    <section className="pt-8 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg aspect-[4/3] animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
