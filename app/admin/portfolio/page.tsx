"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioItem, PortfolioCategory } from "@/lib/supabase-data";

// YouTubeのサムネイルURLを取得
function getYoutubeThumbnail(url: string): string {
  const videoId = extractYoutubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return "";
}

// YouTube URLからVideo IDを抽出
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    loadPortfolios();
    loadCategories();
  }, []);

  const loadPortfolios = async () => {
    try {
      const response = await fetch("/api/admin/portfolio");
      const data = await response.json();
      // sort_orderが存在しない場合はデフォルト値を設定
      const portfoliosWithSortOrder = data.map((item: PortfolioItem, index: number) => ({
        ...item,
        sort_order: item.sort_order ?? index,
      }));
      setPortfolios(portfoliosWithSortOrder);
    } catch (error) {
      console.error("Failed to load portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories/portfolio");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  // フィルタリングされたポートフォリオを取得
  const getFilteredPortfolios = () => {
    if (!selectedCategory) {
      return portfolios;
    }
    return portfolios.filter(item => item.category?.name === selectedCategory);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;

    const filteredPortfolios = getFilteredPortfolios();
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredPortfolios.length) return;

    setIsReordering(true);

    // フィルタリングされたリスト内で入れ替え
    const itemToMove = filteredPortfolios[index];
    const itemToSwap = filteredPortfolios[newIndex];

    // 全体のポートフォリオリストの中でのインデックスを取得
    const fullIndexToMove = portfolios.findIndex(p => p.id === itemToMove.id);
    const fullIndexToSwap = portfolios.findIndex(p => p.id === itemToSwap.id);

    // ローカルで順序を入れ替え
    const newPortfolios = [...portfolios];
    [newPortfolios[fullIndexToMove], newPortfolios[fullIndexToSwap]] =
      [newPortfolios[fullIndexToSwap], newPortfolios[fullIndexToMove]];

    // sort_orderを更新
    const updatedItems = newPortfolios.map((item, i) => ({
      id: item.id,
      sort_order: i,
    }));

    setPortfolios(newPortfolios);

    try {
      const response = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "portfolios", items: updatedItems }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `順序の更新に失敗しました (${response.status})`;
        console.error("Reorder error:", errorData);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Failed to reorder:", error);
      const errorMessage = error?.message || "順序の更新に失敗しました";
      alert(errorMessage);
      await loadPortfolios(); // エラー時は再読み込み
    } finally {
      setIsReordering(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!deleteConfirm || deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadPortfolios();
        setDeleteConfirm(null);
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
      alert("削除に失敗しました");
    }
  };

  // サムネイル画像を取得
  const getThumbnail = (item: PortfolioItem): string | null => {
    if (item.display_type === "gallery" && item.images && item.images.length > 0) {
      return item.images[0];
    }
    if (item.youtube_url) {
      return getYoutubeThumbnail(item.youtube_url);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  const filteredPortfolios = getFilteredPortfolios();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">ポートフォリオ管理</h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          新規作成
        </Link>
      </div>

      {/* カテゴリフィルター */}
      {categories.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-600">カテゴリで絞り込み:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              すべて ({portfolios.length})
            </button>
            {categories.map((category) => {
              const count = portfolios.filter(p => p.category?.name === category.name).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.name
                      ? "text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                  style={selectedCategory === category.name ? { backgroundColor: category.color } : {}}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* フィルター選択時の表示メッセージ */}
      {selectedCategory && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            「<span className="font-medium">{selectedCategory}</span>」カテゴリを表示中（{filteredPortfolios.length}件）
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-2 text-primary-600 hover:underline text-sm"
            >
              フィルターを解除
            </button>
          </p>
        </div>
      )}

      {portfolios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">ポートフォリオがありません</p>
          <Link
            href="/admin/portfolio/new"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            最初のポートフォリオを作成する
          </Link>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">
            「{selectedCategory}」カテゴリのポートフォリオはありません
          </p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            すべてのポートフォリオを表示
          </button>
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
                  サムネイル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  形態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  公開状態
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPortfolios.map((item, index) => {
                const thumbnail = getThumbnail(item);
                return (
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
                          disabled={index === filteredPortfolios.length - 1 || isReordering}
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
                      {thumbnail ? (
                        <div className="relative w-32 h-20 rounded overflow-hidden">
                          <Image
                            src={thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized={thumbnail.includes("youtube.com")}
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-20 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          item.display_type === "gallery"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.display_type === "gallery" ? "画像" : "YouTube"}
                      </span>
                      {item.display_type === "gallery" && item.images && (
                        <span className="ml-1 text-xs text-gray-500">
                          ({item.images.length}枚)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.category ? (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          {item.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">未設定</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          item.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.published ? "公開" : "非公開"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/portfolio/${item.id}/edit`}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
