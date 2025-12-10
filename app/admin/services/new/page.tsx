"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import ImageSelector from "@/components/admin/ImageSelector";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  { ssr: false }
);

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    summary: "",
    image: "",
    categories: [] as string[],
    image_display_mode: "contain" as "contain" | "cover",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories/services");
      if (response.ok) {
        const data = await response.json();
        setAvailableCategories(data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      alert("カテゴリを1つ以上選択してください");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/services");
      } else {
        alert("保存に失敗しました");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Failed to create service:", error);
      alert("保存に失敗しました");
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter(c => c !== categoryName)
        : [...prev.categories, categoryName]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          サービス新規作成
        </h1>
        <Link
          href="/admin/services"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← 一覧に戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="サービスのタイトルを入力"
          />
        </div>

        {/* Categories (Multiple Selection) */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ（複数選択可） *
          </span>
          {availableCategories.length === 0 ? (
            <p className="text-sm text-gray-500">
              カテゴリがありません。
              <Link href="/admin/categories/services" className="text-primary-600 hover:underline ml-1">
                カテゴリを作成
              </Link>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const isSelected = formData.categories.includes(category.name);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={isSelected ? { backgroundColor: category.color } : {}}
                  >
                    {category.name}
                    {isSelected && " ✓"}
                  </button>
                );
              })}
            </div>
          )}
          {formData.categories.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              選択中: {formData.categories.join(", ")}
            </p>
          )}
        </div>

        {/* Image */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">
            画像
          </span>
          <ImageSelector
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />
        </div>

        {/* Image Display Mode */}
        <div>
          <label htmlFor="image_display_mode" className="block text-sm font-medium text-gray-700 mb-2">
            画像表示モード
          </label>
          <select
            id="image_display_mode"
            value={formData.image_display_mode}
            onChange={(e) => setFormData({ ...formData, image_display_mode: e.target.value as "contain" | "cover" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="contain">比率を保つ（余白あり）</option>
            <option value="cover">フル表示（見切れあり）</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            説明（一覧表示用） *
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="一覧ページに表示される説明文を入力"
          />
        </div>

        {/* Content */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">
            本文 *
          </span>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/admin/services"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
