import { getNews } from "@/lib/data";
import NewsCard from "@/components/NewsCard";

export default async function NewsPage() {
  const newsItems = await getNews();

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ニュース
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            最新のお知らせや情報をお届けします。
          </p>
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

