"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsItem } from "@/lib/supabase-data";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch("/api/admin/news");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Failed to load news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!deleteConfirm || deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadNews();
        setDeleteConfirm(null);
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert("削除に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">ニュース管理</h1>
        <Link
          href="/admin/news/new"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          新規作成
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">ニュース記事がありません</p>
          <Link
            href="/admin/news/new"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            最初のニュースを作成する
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  公開日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(item.date), "yyyy年MM月dd日", {
                      locale: ja,
                    })}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/news/${item.id}`}
                      target="_blank"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      表示
                    </Link>
                    <Link
                      href={`/admin/news/${item.id}/edit`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`${
                        deleteConfirm === item.id
                          ? "text-red-600 hover:text-red-900 font-bold"
                          : "text-red-600 hover:text-red-900"
                      }`}
                    >
                      {deleteConfirm === item.id ? "確認：削除" : "削除"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



