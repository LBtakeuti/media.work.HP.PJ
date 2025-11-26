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

export default function NewNewsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    summary: "",
    content: "",
    image: "/sevilla-tower-g8a5d080a4_640.jpg",
    categories: [] as string[],
    image_display_mode: "contain" as "contain" | "cover",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories/news");
      if (response.ok) {
        const data: Category[] = await response.json();
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
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/news");
      } else {
        alert("保存に失敗しました");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Failed to create news:", error);
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
          ニュース新規作成
        </h1>
        <Link
          href="/admin/news"
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
            placeholder="ニュースのタイトルを入力"
          />
        </div>

        {/* Categories (Multiple Selection) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ（複数選択可） *
          </label>
          {availableCategories.length === 0 ? (
            <p className="text-sm text-gray-500">
              カテゴリがありません。
              <Link href="/admin/categories/news" className="text-primary-600 hover:underline ml-1">
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

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            公開日 *
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            画像
          </label>
          <ImageSelector
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />
        </div>

        {/* Image Display Mode */}
        <div>
          <label htmlFor="image_display_mode" className="block text-sm font-medium text-gray-700 mb-2">
            画像表示方法
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
          <p className="mt-1 text-sm text-gray-500">
            「比率を保つ」: 画像全体が表示され、左右または上下に余白が生じます<br />
            「フル表示」: カード全体に画像が広がりますが、一部見切れる場合があります
          </p>
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            概要（一覧表示用）
          </label>
          <textarea
            id="summary"
            rows={3}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="一覧ページに表示される概要を入力"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            本文 *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
          />
          <p className="mt-1 text-xs text-gray-500">
            リッチテキストエディタで本文を作成できます。
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/admin/news"
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
