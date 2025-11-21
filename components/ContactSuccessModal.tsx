"use client";

import { useEffect } from "react";

interface ContactSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSuccessModal({
  isOpen,
  onClose,
}: ContactSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // モーダルが開いたら背景スクロールを無効化
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative animate-appear-zoom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="閉じる"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Message */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            お問い合わせありがとうございます
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed whitespace-nowrap">
            お問い合わせ内容を確認次第、担当者よりご連絡いたします。
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

