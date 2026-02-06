"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ImageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルタイプチェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      alert("ファイルサイズは10MB以下にしてください");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Supabase Storageにアップロード
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "アップロードに失敗しました");
      }

      // アップロード成功 - URLを使用
      setPreview(result.url);
      onChange(result.url);
    } catch (error) {
      console.error("画像のアップロードに失敗しました:", error);
      setUploadError(error instanceof Error ? error.message : "アップロードに失敗しました");

      // フォールバック: base64として保存（Storageが使えない場合）
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {isUploading ? "アップロード中..." : "クリックして画像を選択"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF, WEBP（最大10MB）
            </p>
          </div>
        </div>
      </button>

      {/* Upload Error */}
      {uploadError && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="font-medium">Storage未設定のため、従来の方式で保存されます</p>
          <p className="text-xs mt-1">{uploadError}</p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-700">プレビュー</p>
              {preview.startsWith('http') && (
                <p className="text-xs text-green-600">✓ Storageに保存済み</p>
              )}
              {preview.startsWith('data:') && (
                <p className="text-xs text-amber-600">⚠ Base64（大容量）</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setPreview("");
                onChange("");
                setUploadError(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-xs text-red-600 hover:text-red-700"
            >
              削除
            </button>
          </div>
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white">
            <Image
              src={preview}
              alt="プレビュー"
              fill
              className="object-contain"
              unoptimized={preview.startsWith('data:')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
