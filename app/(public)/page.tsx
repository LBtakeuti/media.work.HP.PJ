import Link from "next/link";
import Image from "next/image";
import { getNews, getServices } from "@/lib/supabase-data";
import SmallNewsCard from "@/components/SmallNewsCard";
import ServiceCard from "@/components/ServiceCard";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import AnimatedTitle from "@/components/AnimatedTitle";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import type { Metadata } from "next";

// キャッシュを無効化し、毎回最新データを取得
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "株式会社メディア・ワーク",
  description: "1975年創業、東京の印刷製版会社から進化したメディア制作のプロ集団。組版・グラフィックデザインからAI動画撮影サービスSAVREQ、Web制作まで、企画から運営までワンストップでサポート。伝統と革新を融合し、心に残る瞬間を未来へ届けます。",
  openGraph: {
    title: "株式会社メディア・ワーク",
    description: "1975年創業、東京の印刷製版会社から進化したメディア制作のプロ集団。組版・グラフィックデザインからAI動画撮影サービスSAVREQ、Web制作まで、企画から運営までワンストップでサポート。伝統と革新を融合し、心に残る瞬間を未来へ届けます。",
    images: ["/ogp-image.png"],
  },
};

export default async function Home() {
  const newsItems = await getNews();
  const latestNews = newsItems.slice(0, 4); // 最新4件を表示
  const services = await getServices();
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute top-0 bottom-0 left-4 right-4 md:left-8 md:right-8 z-0 rounded-lg overflow-hidden">
          <Image
            src="/TOP-photo.avif"
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
            unoptimized={false}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AnimatedTitle
              text="心に残る瞬間を、|未来に届ける。"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg"
              highlightColor="text-[#393D45]"
              duration={2000}
            />
            <p className="text-2xl text-white max-w-3xl mx-auto drop-shadow-md">
              The medium is the message
            </p>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="relative py-16 bg-white overflow-hidden">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6 text-center">
            心に残る瞬間を、未来へ届ける。
            <br />
            メディア戦略のプロフェッショナル集団
          </h2>
          <div className="space-y-6 text-[14px] text-gray-700 leading-relaxed text-center">
            <p>
              イベントの感動を、
              <br />
              パーソナライズされた映像で永遠に。
            </p>
            <p>
              企業の顔となるホームページやパンフレットを、
              <br />
              想いを込めて創り上げる。
            </p>
            <p>
              私たちメディア・ワークは、
              <br />
              単なる制作会社ではありません。
            </p>
            <p>
              貴社のメディア展開を、
              <br />
              企画から運営、そして記憶に残るアウトプットまで、
              <br />
              ワンストップでサポートする戦略パートナーです。
            </p>
            <p>
              最新のテクノロジーと長年の経験で、
              <br />
              貴社の『伝えたい』をカタチにし、
              <br />
              ビジネスの成長と成功に貢献します。
            </p>
          </div>
          <div className="text-[14px] text-center space-y-1 mt-12" style={{ color: '#FD8882' }}>
            <p>当社は、Reds Business Clubのメンバーです。</p>
            <p>当社は、葛飾区からJリーグを目指す南葛SCを応援しています。</p>
            <p>当社は、ジョイフル本田つくばFC・関口訓充選手の個人パートナーです。</p>
          </div>
        </div>
        {/* Gradient transition to Services Section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
      </section>

      {/* Services Section */}
      <section className="pt-20 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <AnimatedSectionTitle className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">
              サービス<span className="text-xl md:text-2xl font-normal ml-2">/SERVICE</span>
            </AnimatedSectionTitle>
            <Link
              href="/services"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
            >
              もっと見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {(() => {
            const fullRows = Math.floor(services.length / 4);
            const remainder = services.length % 4;
            const topServices = services.slice(0, fullRows * 4);
            const bottomServices = services.slice(fullRows * 4);

            return (
              <>
                {/* 上段: 4列グリッド */}
                {topServices.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {topServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        title={service.title}
                        categories={service.categories}
                        imageSrc={service.image}
                        imageAlt={service.title}
                        href={`/services/${service.slug || service.id}`}
                        imageDisplayMode={service.image_display_mode}
                        size="small"
                      />
                    ))}
                  </div>
                )}
                {/* 下段: 中央揃え（上段と同じコンポーネントとスタイル） */}
                {bottomServices.length > 0 && (
                  <>
                    {/* モバイル: 2列グリッド */}
                    <div className="grid grid-cols-2 gap-4 mt-4 md:hidden">
                      {bottomServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          title={service.title}
                          categories={service.categories}
                          imageSrc={service.image}
                          imageAlt={service.title}
                          href={`/services/${service.slug || service.id}`}
                          imageDisplayMode={service.image_display_mode}
                          size="small"
                        />
                      ))}
                    </div>
                    {/* PC: flexboxで中央揃え */}
                    <div className="hidden md:flex justify-center items-start gap-4 mt-4">
                      {bottomServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          title={service.title}
                          categories={service.categories}
                          imageSrc={service.image}
                          imageAlt={service.title}
                          href={`/services/${service.slug || service.id}`}
                          imageDisplayMode={service.image_display_mode}
                          size="small"
                          className="flex-shrink-0 w-[calc(25%-12px)]"
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* News Section */}
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


    </div>
  );
}

