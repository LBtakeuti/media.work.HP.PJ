import Link from "next/link";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/lib/data";

export default async function ServicesPage() {
  const services = await getServices();

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

      {/* Services List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                imageSrc={service.image}
                category={service.category}
                title={service.title}
                description={service.description}
                href={`/services/${service.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ご質問がございましたら
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            サービスに関するご質問やご相談がございましたら、お気軽にお問い合わせください。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            お問い合わせフォームへ
          </Link>
        </div>
      </section>
    </div>
  );
}


