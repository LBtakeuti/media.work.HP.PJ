import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          記事が見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しの記事は存在しないか、削除された可能性があります。
        </p>
        <Link
          href="/news"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          ニュース一覧に戻る
        </Link>
      </div>
    </div>
  );
}

