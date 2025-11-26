import Link from "next/link";
import Image from "next/image";
import { getNews, getServices } from "@/lib/supabase-data";
import NewsCard from "@/components/NewsCard";
import ServiceCard from "@/components/ServiceCard";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import AnimatedTitle from "@/components/AnimatedTitle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "株式会社メディア・ワーク",
  description: "1975年創業、東京の印刷製版会社から進化したメディア制作のプロ集団。組版・グラフィックデザインからAI動画撮影サービスSAVREQ、Web制作まで、企画から運営までワンストップでサポート。伝統と革新を融合し、心に残る瞬間を未来へ届けます。",
  openGraph: {
    title: "株式会社メディア・ワーク",
    description: "1975年創業、東京の印刷製版会社から進化したメディア制作のプロ集団。組版・グラフィックデザインからAI動画撮影サービスSAVREQ、Web制作まで、企画から運営までワンストップでサポート。伝統と革新を融合し、心に残る瞬間を未来へ届けます。",
    images: ["/logo.jpg"],
  },
};

export default async function Home() {
  const newsItems = await getNews();
  const latestNews = newsItems.slice(0, 3); // 最新3件を表示
  const services = await getServices();
  const topServices = services.slice(0, 3); // 最初の3件を表示
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute top-0 bottom-0 left-4 right-4 md:left-8 md:right-8 z-0 rounded-lg overflow-hidden">
          <Image
            src="/photo-1451976426598-a7593bd6d0b2.avif"
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
              text="心に残る瞬間を、未来に届ける。"
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
            心に残る瞬間を、未来へ届ける。メディア戦略のプロフェッショナル集団
          </h2>
          <div className="space-y-4 text-[15px] md:text-[14px] text-gray-700 leading-relaxed">
            <p>
              イベントの感動を、パーソナライズされた映像で永遠に。
            </p>
            <p>
              企業の顔となるホームページやパンフレットを、想いを込めて創り上げる。
            </p>
            <p>
              私たちメディア・ワークは、単なる制作会社ではありません。
            </p>
            <p>
              貴社のメディア展開を、企画から運営、そして記憶に残るアウトプットまで、ワンストップでサポートする戦略パートナーです。
            </p>
            <p>
              最新のテクノロジーと長年の経験で、貴社の『伝えたい』をカタチにし、ビジネスの成長と成功に貢献します。
            </p>
          </div>
        </div>
        {/* Gradient transition to Services Section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            サービス
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                category={service.category}
                imageSrc={service.image}
                imageAlt={service.title}
                href={`/services/${service.id}`}
              />
            ))}
            <ServiceCard
              title="サービスタイトル4"
              description="サービスの説明文がここに入ります。詳細な説明を記載します。"
              date="2025年11月17日"
              category="プレスリリース"
              imageAlt="サービス4"
            />
            <ServiceCard
              title="サービスタイトル5"
              description="サービスの説明文がここに入ります。詳細な説明を記載します。"
              date="2025年11月17日"
              category="プレスリリース"
              imageAlt="サービス5"
            />
            <ServiceCard
              title="サービスタイトル6"
              description="サービスの説明文がここに入ります。詳細な説明を記載します。"
              date="2025年11月17日"
              category="プレスリリース"
              imageAlt="サービス6"
            />
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            ニュース
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}

