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
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/news");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ニュースの取得に失敗しました");
      }

      // 配列であることを確認
      if (Array.isArray(data)) {
        setNews(data);
      } else {
        console.error("Unexpected response format:", data);
        setNews([]);
        setError("データ形式が不正です");
      }
    } catch (error) {
      console.error("Failed to load news:", error);
      setError(error instanceof Error ? error.message : "ニュースの取得に失敗しました");
      setNews([]);
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

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= news.length) return;

    setIsReordering(true);

    // ローカルで順序を入れ替え
    const newNews = [...news];
    [newNews[index], newNews[newIndex]] = [newNews[newIndex], newNews[index]];

    // sort_orderを更新
    const updatedItems = newNews.map((item, i) => ({
      id: item.id,
      sort_order: i,
    }));

    setNews(newNews);

    try {
      const response = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "news", items: updatedItems }),
      });

      if (!response.ok) {
        throw new Error("順序の更新に失敗しました");
      }
    } catch (error) {
      console.error("Failed to reorder:", error);
      alert("順序の更新に失敗しました");
      await loadNews(); // エラー時は再読み込み
    } finally {
      setIsReordering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              loadNews();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            再試行
          </button>
        </div>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  順序
                </th>
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
              {news.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0 || isReordering}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="上へ移動"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === news.length - 1 || isReordering}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="下へ移動"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.categories && item.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.categories.map((category) => (
                          <span
                            key={category}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">未設定</span>
                    )}
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



