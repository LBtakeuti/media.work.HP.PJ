import { getServiceBySlug, getServices } from "@/lib/supabase-data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// ISR: 60秒間キャッシュし、バックグラウンドで再生成
export const revalidate = 60;

// ビルド時に既存のサービスページをプリレンダリング
export async function generateStaticParams() {
  const services = await getServices();
  return services
    .filter((item) => item.slug)
    .map((item) => ({ slug: item.slug! }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              ホーム
            </Link>
            <span>/</span>
            <Link
              href="/services"
              className="hover:text-primary-600 transition-colors"
            >
              事業案内
            </Link>
            <span>/</span>
            <span className="text-gray-900">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Service Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        {service.categories && service.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {service.categories.map((category, index) => (
              <span 
                key={index}
                className="inline-block px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {service.title}
        </h1>

        {/* Summary */}
        {service.summary && (
          <div className="text-lg text-gray-700 mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-primary-600">
            {service.summary}
          </div>
        )}

        {/* Main Image */}
        {service.image && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className={service.image_display_mode === "cover" ? "object-cover" : "object-contain"}
              priority
              unoptimized={service.image?.startsWith("data:")}
            />
          </div>
        )}


        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: service.content || "" }}
        />

        {/* Back to Services List */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/services"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            事業案内一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
}

