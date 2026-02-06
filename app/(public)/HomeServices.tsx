import Link from "next/link";
import { getServices } from "@/lib/supabase-data";
import ServiceCard from "@/components/ServiceCard";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";

export default async function HomeServices() {
  const services = await getServices();

  const fullRows = Math.floor(services.length / 4);
  const topServices = services.slice(0, fullRows * 4);
  const bottomServices = services.slice(fullRows * 4);

  return (
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
          {/* 下段: 中央揃え */}
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
      </div>
    </section>
  );
}

// ローディング用スケルトン
export function HomeServicesSkeleton() {
  return (
    <section className="pt-20 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg aspect-[4/3] animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
