import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/data";
import NewsCard from "@/components/NewsCard";
import ServiceCard from "@/components/ServiceCard";

export default async function Home() {
  const newsItems = await getNews();
  const latestNews = newsItems.slice(0, 3); // 最新3件を表示
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute top-0 bottom-0 left-4 right-4 md:left-8 md:right-8 z-0 rounded-lg overflow-hidden">
          <Image
            src="/sevilla-tower-g8a5d080a4_640.jpg"
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              心に残る瞬間を、未来に届ける。
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-md">
              私たちは、お客様の生活をより豊かにするサービスを提供しています。
            </p>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-6 text-center">
            心に残る瞬間を、未来へ届ける。メディア戦略のプロフェッショナル集団
          </h2>
          <div className="space-y-4 text-[14px] text-gray-700 leading-relaxed">
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
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            サービス
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard
              title="サービスタイトル1"
              description="サービスの説明文がここに入ります。詳細な説明を記載します。"
              date="2025年11月17日"
              category="プレスリリース"
              imageAlt="サービス1"
            />
            <ServiceCard
              title="サービスタイトル2"
              description="サービスの説明文がここに入ります。詳細な説明を記載します。"
              date="2025年11月17日"
              category="プレスリリース"
              imageAlt="サービス2"
            />
            <ServiceCard
              title="サービスタイトル3"
              description="サービスの説明文がここに入ります。詳細な説明を記載します。"
              date="2025年11月17日"
              category="プレスリリース"
              imageAlt="サービス3"
            />
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

      {/* Company Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              企業紹介
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              私たちは、お客様のニーズに応える革新的なソリューションを提供しています。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">イノベーション</h3>
              <p className="text-gray-600">
                最新のテクノロジーを活用し、常に新しい価値を創造します。
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">お客様第一</h3>
              <p className="text-gray-600">
                お客様の満足を最優先に考え、質の高いサービスを提供します。
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">信頼性</h3>
              <p className="text-gray-600">
                安全で確実なサービス提供を心がけています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              サービス概要
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              お客様のビジネスをサポートする多様なサービスを提供しています。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">サービス1</h3>
              <p className="text-gray-600 mb-6">
                詳細な説明がここに入ります。サービスの特徴やメリットを説明します。
              </p>
              <Link
                href="/services"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                詳細を見る →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">サービス2</h3>
              <p className="text-gray-600 mb-6">
                詳細な説明がここに入ります。サービスの特徴やメリットを説明します。
              </p>
              <Link
                href="/services"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                詳細を見る →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">サービス3</h3>
              <p className="text-gray-600 mb-6">
                詳細な説明がここに入ります。サービスの特徴やメリットを説明します。
              </p>
              <Link
                href="/services"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                詳細を見る →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">サービス4</h3>
              <p className="text-gray-600 mb-6">
                詳細な説明がここに入ります。サービスの特徴やメリットを説明します。
              </p>
              <Link
                href="/services"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                詳細を見る →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

