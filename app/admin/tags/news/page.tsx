"use client";

import { useEffect, useState } from "react";

interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export default function AdminNewsTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await fetch("/api/admin/tags/news");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const response = await fetch("/api/admin/tags/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (response.ok) {
        setNewTagName("");
        await loadTags();
      } else {
        const error = await response.json();
        alert(error.error || "作成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
      alert("作成に失敗しました");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      const response = await fetch(`/api/admin/tags/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditingName("");
        await loadTags();
      } else {
        const error = await response.json();
        alert(error.error || "更新に失敗しました");
      }
    } catch (error) {
      console.error("Failed to update tag:", error);
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async (id: string) => {
    if (!deleteConfirm || deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const response = await fetch(`/api/admin/tags/news/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteConfirm(null);
        await loadTags();
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      alert("削除に失敗しました");
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ニュースタグマスタ</h1>
      </div>

      {/* Create New Tag */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">新しいタグを作成</h2>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="タグ名を入力"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            追加
          </button>
        </form>
      </div>

      {/* Tags List */}
      {tags.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">タグがありません</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タグ名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingId === tag.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        autoFocus
                      />
                    ) : (
                      <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                        {tag.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(tag.createdAt).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    {editingId === tag.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(tag.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(tag)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className={`${
                            deleteConfirm === tag.id
                              ? "text-red-600 hover:text-red-900 font-bold"
                              : "text-red-600 hover:text-red-900"
                          }`}
                        >
                          {deleteConfirm === tag.id ? "確認：削除" : "削除"}
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
    </div>
  );
}

