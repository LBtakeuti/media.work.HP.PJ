import Link from "next/link";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";
import { getServices, getServiceCategories } from "@/lib/supabase-data";
import type { Metadata } from "next";

// キャッシュを無効化し、毎回最新データを取得
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "サービス | 株式会社メディア・ワーク",
  description: "株式会社メディア・ワークが提供するサービスをご紹介します。",
  openGraph: {
    title: "サービス | 株式会社メディア・ワーク",
    description: "株式会社メディア・ワークが提供するサービスをご紹介します。",
    images: ["/ogp-image.png"],
  },
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allServices = await getServices();
  const categories = await getServiceCategories();
  
  // Filter by category if specified
  const selectedCategory = searchParams.category;
  const services = selectedCategory
    ? allServices.filter(item => item.categories?.includes(selectedCategory))
    : allServices;

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

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600">カテゴリで絞り込み:</span>
              <Link
                href="/services"
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
                  href={`/services?category=${encodeURIComponent(category.name)}`}
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

      {/* Services List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory && (
            <div className="mb-8">
              <p className="text-gray-600">
                「<span className="font-medium">{selectedCategory}</span>」のサービスを表示中
                <Link href="/services" className="ml-2 text-primary-600 hover:underline text-sm">
                  フィルターを解除
                </Link>
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategory 
                    ? `「${selectedCategory}」カテゴリのサービスはありません。`
                    : "サービスはありません。"
                  }
                </p>
              </div>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  imageSrc={service.image}
                  categories={service.categories}
                  title={service.title}
                  description={service.description}
                  href={`/services/${service.slug || service.id}`}
                  imageDisplayMode={service.image_display_mode}
                />
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
