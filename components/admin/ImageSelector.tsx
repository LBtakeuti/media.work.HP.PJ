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

    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください");
      return;
    }

    setIsUploading(true);

    try {
      // ローカルプレビュー用のData URLを作成
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("画像の読み込みに失敗しました:", error);
      alert("画像の読み込みに失敗しました");
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
              {isUploading ? "読み込み中..." : "クリックして画像を選択"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF, WEBP, AVIF（最大5MB）
            </p>
          </div>
        </div>
      </button>

      {/* Preview */}
      {preview && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">プレビュー</p>
            <button
              type="button"
              onClick={() => {
                setPreview("");
                onChange("");
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
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}

