"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PortfolioCategory } from "@/lib/supabase-data";

type DisplayType = 'youtube' | 'gallery';

export default function NewPortfolioPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    published: true,
    display_type: "youtube" as DisplayType,
    category_id: "",
    images: [] as string[],
    reference_url: "",
    image_display_mode: "cover" as "contain" | "cover",
  });

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
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // ファイルタイプの検証
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          errors.push(`「${file.name}」: 許可されていないファイル形式です`);
          continue;
        }

        // ファイルサイズの検証（10MB以下）
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          errors.push(`「${file.name}」: ファイルサイズが大きすぎます（10MB以下）`);
          continue;
        }

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formDataUpload,
          });

          const data = await response.json();

          if (response.ok && data.url) {
            newImages.push(data.url);
          } else {
            const errorMessage = data.error || "アップロードに失敗しました";
            errors.push(`「${file.name}」: ${errorMessage}`);
            console.error(`Upload failed for ${file.name}:`, data);
          }
        } catch (uploadError) {
          console.error(`Upload error for ${file.name}:`, uploadError);
          errors.push(`「${file.name}」: アップロード中にエラーが発生しました`);
        }
      }

      // 成功した画像を追加
      if (newImages.length > 0) {
        setFormData({
          ...formData,
          images: [...formData.images, ...newImages],
        });
      }

      // エラーメッセージを表示
      if (errors.length > 0) {
        alert(`以下の画像のアップロードに失敗しました:\n${errors.join('\n')}`);
      }

      if (newImages.length > 0 && errors.length === 0) {
        // すべて成功した場合のみ成功メッセージを表示
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert("画像のアップロード中に予期しないエラーが発生しました");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formData.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.display_type === 'youtube' && !formData.youtube_url) {
      alert("YouTube URLを入力してください");
      return;
    }
    if (formData.display_type === 'gallery' && formData.images.length === 0) {
      alert("画像を1枚以上アップロードしてください");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        category_id: formData.category_id || null,
      };

      const response = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push("/admin/portfolio");
      } else {
        const error = await response.json();
        alert(error.message || "作成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to create portfolio:", error);
      alert("作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/portfolio"
          className="text-gray-600 hover:text-gray-900"
        >
          &larr; 戻る
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          ポートフォリオ新規作成
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* 投稿形態の選択 */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              投稿形態 <span className="text-red-500">*</span>
            </span>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="display_type"
                  value="youtube"
                  checked={formData.display_type === "youtube"}
                  onChange={(e) =>
                    setFormData({ ...formData, display_type: e.target.value as DisplayType })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">YouTube動画</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="display_type"
                  value="gallery"
                  checked={formData.display_type === "gallery"}
                  onChange={(e) =>
                    setFormData({ ...formData, display_type: e.target.value as DisplayType })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">画像ギャラリー</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="タイトル"
            />
          </div>

          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              カテゴリ
            </label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">カテゴリを選択</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* YouTube形式の場合 */}
          {formData.display_type === "youtube" && (
            <div>
              <label
                htmlFor="youtube_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                YouTube URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="youtube_url"
                value={formData.youtube_url}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-sm text-gray-500 mt-1">
                YouTube動画のURLを入力してください
              </p>
            </div>
          )}

          {/* 画像ギャラリー形式の場合 */}
          {formData.display_type === "gallery" && (
            <>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  画像 <span className="text-red-500">*</span>
                </span>
                <div className="space-y-4">
                  {/* アップロードボタン */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          アップロード中...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          画像を追加
                        </>
                      )}
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      複数選択可能です。ページめくり形式で表示されます。
                    </p>
                  </div>

                  {/* アップロード済み画像一覧 */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={image}
                              alt={`画像 ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, 'up')}
                                className="bg-white/90 hover:bg-white p-1 rounded shadow"
                                title="前に移動"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            )}
                            {index < formData.images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, 'down')}
                                className="bg-white/90 hover:bg-white p-1 rounded shadow"
                                title="後ろに移動"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded shadow"
                              title="削除"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 画像表示モード */}
              <div>
                <label
                  htmlFor="image_display_mode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  画像表示モード
                </label>
                <select
                  id="image_display_mode"
                  value={formData.image_display_mode}
                  onChange={(e) =>
                    setFormData({ ...formData, image_display_mode: e.target.value as "contain" | "cover" })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="cover">フル表示（見切れあり）</option>
                  <option value="contain">比率を保つ（余白あり）</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  画像の表示方法を選択します
                </p>
              </div>

              <div>
                <label
                  htmlFor="reference_url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  参照リンク
                </label>
                <input
                  type="url"
                  id="reference_url"
                  value={formData.reference_url}
                  onChange={(e) =>
                    setFormData({ ...formData, reference_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  関連サイトやプロジェクトへのリンク（任意）
                </p>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              説明
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="説明（任意）"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="published"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              公開する
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/portfolio"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "作成中..." : "作成"}
          </button>
        </div>
      </form>
    </div>
  );
}
