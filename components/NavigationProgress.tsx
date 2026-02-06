"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // ナビゲーション開始を検知
  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
      setProgress(0);
    };

    // リンククリックを検知
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && link.href && !link.href.startsWith("#") && !link.target) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          // 同一オリジンの内部リンクの場合
          if (url.pathname !== pathname || url.search !== window.location.search) {
            handleStart();
          }
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [pathname]);

  // ナビゲーション完了を検知
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // プログレスバーのアニメーション
  useEffect(() => {
    if (isNavigating && progress < 90) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          // 最初は早く、徐々に遅くなる
          const increment = Math.max(1, (90 - prev) / 10);
          return Math.min(90, prev + increment);
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isNavigating, progress]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div
        className="h-full bg-primary-600 transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(30, 58, 95, 0.7), 0 0 5px rgba(30, 58, 95, 0.5)",
        }}
      />
    </div>
  );
}
