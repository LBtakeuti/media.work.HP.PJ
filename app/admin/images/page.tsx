"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface UploadedImage {
  url: string;
  fileName: string;
}

export default function ImagesPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/upload/list");
      const data = await response.json();
      setUploadedImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("画像一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("画像のアップロードに成功しました");
        // 画像一覧を再取得
        fetchImages();
        // ファイル入力をリセット
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(data.error || "アップロードに失敗しました");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("アップロード中にエラーが発生しました");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setSuccess("URLをクリップボードにコピーしました");
    setTimeout(() => setSuccess(null), 3000);
  };

  const deleteImage = async (fileName: string) => {
    if (!confirm("この画像を削除しますか？")) return;

    try {
      const response = await fetch(`/api/admin/upload/${fileName}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 画像一覧を再取得
        fetchImages();
        setSuccess("画像を削除しました");
      } else {
        setError("削除に失敗しました");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("削除中にエラーが発生しました");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← 戻る
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">画像管理</h1>
          <p className="text-gray-600">画像をアップロードして管理できます。</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">画像をアップロード</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer inline-block ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-primary-600 hover:text-primary-700">
                  クリックして画像を選択
                </span>
                <span className="ml-2">またはドラッグ＆ドロップ</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                JPEG、PNG、GIF、WebP形式、最大10MB
              </p>
            </label>
          </div>

          {uploading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-sm text-gray-600">アップロード中...</p>
            </div>
          )}
        </div>

        {/* Uploaded Images */}
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">アップロード済み画像</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-500">読み込み中...</p>
            </div>
          ) : uploadedImages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">アップロードされた画像はありません</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedImages.map((image) => (
                <div
                  key={image.fileName}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-video bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.fileName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2 truncate">{image.fileName}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(image.url)}
                        className="flex-1 bg-primary-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-primary-700 transition-colors"
                      >
                        URLをコピー
                      </button>
                      <button
                        onClick={() => deleteImage(image.fileName)}
                        className="bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-700 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

