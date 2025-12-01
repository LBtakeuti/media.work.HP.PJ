"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PortfolioCategory } from "@/lib/supabase-data";

export default function AdminPortfolioCategoriesPage() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySortOrder, setNewCategorySortOrder] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingSortOrder, setEditingSortOrder] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/portfolio-categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAdding(true);
    try {
      const response = await fetch("/api/admin/portfolio-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          sort_order: newCategorySortOrder,
        }),
      });

      if (response.ok) {
        setNewCategoryName("");
        setNewCategorySortOrder(0);
        await loadCategories();
      } else {
        const error = await response.json();
        alert(error.error || "作成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("作成に失敗しました");
    } finally {
      setIsAdding(false);
    }
  };

  const startEditing = (category: PortfolioCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingSortOrder(category.sort_order || 0);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
    setEditingSortOrder(0);
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      const response = await fetch(`/api/admin/portfolio-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingName.trim(),
          sort_order: editingSortOrder,
        }),
      });

      if (response.ok) {
        cancelEditing();
        await loadCategories();
      } else {
        const error = await response.json();
        alert(error.error || "更新に失敗しました");
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async (id: string) => {
    if (!deleteConfirm || deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const response = await fetch(`/api/admin/portfolio-categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadCategories();
        setDeleteConfirm(null);
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/portfolio"
          className="text-gray-600 hover:text-gray-900"
        >
          &larr; ポートフォリオ管理
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">カテゴリ管理</h1>
      </div>

      {/* 新規追加フォーム */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          新規カテゴリ追加
        </h2>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <label
              htmlFor="new-category-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              カテゴリ名
            </label>
            <input
              type="text"
              id="new-category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="例: ウェブ制作"
            />
          </div>
          <div className="w-32">
            <label
              htmlFor="new-category-sort"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              表示順
            </label>
            <input
              type="number"
              id="new-category-sort"
              value={newCategorySortOrder}
              onChange={(e) =>
                setNewCategorySortOrder(parseInt(e.target.value) || 0)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !newCategoryName.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isAdding ? "追加中..." : "追加"}
          </button>
        </form>
      </div>

      {/* カテゴリ一覧 */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">カテゴリがありません</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  表示順
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ名
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="number"
                        value={editingSortOrder}
                        onChange={(e) =>
                          setEditingSortOrder(parseInt(e.target.value) || 0)
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {category.sort_order || 0}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(category)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className={`${
                            deleteConfirm === category.id
                              ? "text-red-600 hover:text-red-900 font-bold"
                              : "text-red-600 hover:text-red-900"
                          }`}
                        >
                          {deleteConfirm === category.id ? "確認：削除" : "削除"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        ※ カテゴリを削除しても、そのカテゴリに紐付いていたポートフォリオは削除されません（カテゴリが未設定になります）
      </p>
    </div>
  );
}
