"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ServiceItem } from "@/lib/supabase-data";
import dynamic from "next/dynamic";
import ImageSelector from "@/components/admin/ImageSelector";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  { ssr: false }
);

interface ServiceTag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceTags, setServiceTags] = useState<ServiceTag[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "サービスカテゴリ",
    description: "",
    content: "",
    summary: "",
    image: "",
    tags: [] as string[],
    image_display_mode: "contain" as "contain" | "cover",
  });

  useEffect(() => {
    loadServiceTags();
    loadService();
  }, []);

  const loadServiceTags = async () => {
    try {
      const response = await fetch("/api/admin/tags/services");
      if (response.ok) {
        const tags = await response.json();
        setServiceTags(tags);
      }
    } catch (error) {
      console.error("Failed to load service tags:", error);
    }
  };

  const loadService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${params.id}`);
      if (response.ok) {
        const data: ServiceItem = await response.json();
        setFormData({
          title: data.title,
          category: data.category,
          description: data.description,
          content: data.content,
          summary: data.summary || "",
          image: data.image || "",
          tags: data.tags || [],
          image_display_mode: data.image_display_mode || "contain",
        });
      } else {
        alert("サービスが見つかりません");
        router.push("/admin/services");
      }
    } catch (error) {
      console.error("Failed to load service:", error);
      alert("読み込みに失敗しました");
      router.push("/admin/services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/services/${params.id}`, {
        method: "PUT",
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
      console.error("Failed to update service:", error);
      alert("保存に失敗しました");
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagName: string) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tagName);
      return {
        ...prev,
        tags: isSelected
          ? prev.tags.filter((t) => t !== tagName)
          : [...prev.tags, tagName],
      };
    });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          サービス編集
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
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ *
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="サービスカテゴリ">サービスカテゴリ</option>
            <option value="プレスリリース">プレスリリース</option>
            <option value="コンサルティング">コンサルティング</option>
            <option value="開発">開発</option>
          </select>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            本文 *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
          <p className="mt-1 text-xs text-gray-500">
            ツールバーを使用してテキストを装飾できます。
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.tags.includes(tag.name)
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={
                  formData.tags.includes(tag.name)
                    ? { backgroundColor: tag.color, color: "white" }
                    : {}
                }
              >
                {tag.name}
              </button>
            ))}
          </div>
          {serviceTags.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              タグが登録されていません。
              <Link href="/admin/tags/services" className="text-primary-600 hover:underline ml-1">
                タグを作成
              </Link>
            </p>
          )}
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

