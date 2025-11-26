import { getNewsById } from "@/lib/supabase-data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const news = await getNewsById(params.id);

  if (!news) {
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
              href="/news"
              className="hover:text-primary-600 transition-colors"
            >
              ニュース
            </Link>
            <span>/</span>
            <span className="text-gray-900">{news.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category & Date */}
        <div className="flex items-center gap-4 mb-6">
          <span className="inline-block px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded">
            {news.category}
          </span>
          <time className="text-sm text-gray-600">
            {format(new Date(news.date), "yyyy年MM月dd日", { locale: ja })}
          </time>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {news.title}
        </h1>

        {/* Summary */}
        {news.summary && (
          <div className="text-lg text-gray-700 mb-8 p-6 bg-gray-50 rounded-lg">
            {news.summary}
          </div>
        )}

        {/* Main Image */}
        {news.image && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content || "" }}
        />

        {/* Back to News List */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/news"
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
            ニュース一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
}
