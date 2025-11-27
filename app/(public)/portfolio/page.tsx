import { getPublishedPortfolios } from "@/lib/supabase-data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ポートフォリオ | 株式会社メディア・ワーク",
  description: "株式会社メディア・ワークの制作実績をご紹介します。",
  openGraph: {
    title: "ポートフォリオ | 株式会社メディア・ワーク",
    description: "株式会社メディア・ワークの制作実績をご紹介します。",
    images: ["/ogp-image.png"],
  },
};

// YouTube URLからembed用のURLを生成
function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  return null;
}

export default async function PortfolioPage() {
  const portfolios = await getPublishedPortfolios();

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0"></div>
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
          {portfolios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                ポートフォリオはまだありません。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolios.map((item) => {
                const embedUrl = getYoutubeEmbedUrl(item.youtube_url);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {embedUrl && (
                      <div className="relative w-full pt-[56.25%]">
                        <iframe
                          src={embedUrl}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
