"use client";

import { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import Image from "next/image";
import { PortfolioItem, PortfolioCategory } from "@/lib/supabase-data";

interface PortfolioGridProps {
  portfolios: PortfolioItem[];
  categories: PortfolioCategory[];
}

// スワイプ用カスタムフック
function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}

// カルーセルセクションコンポーネント
function CarouselSection({
  title,
  items,
  onFullscreen,
}: {
  title: string;
  items: PortfolioItem[];
  onFullscreen: (item: PortfolioItem) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsAtStart(container.scrollLeft <= 0);
      setIsAtEnd(
        container.scrollLeft >= container.scrollWidth - container.clientWidth - 10
      );
    }
  }, []);

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [checkScrollPosition, items]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth / 3;

    if (direction === "left") {
      if (isAtStart) {
        // 最初にいる場合は最後へジャンプ
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    } else {
      if (isAtEnd) {
        // 最後にいる場合は最初へジャンプ
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }
  };

  if (items.length === 0) return null;

  // アイテムが少なくてスクロールが不要な場合はボタンを非表示
  const showButtons = items.length > 3;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="relative">
        {/* 左矢印 - 常に表示（無限ループ） */}
        {showButtons && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg text-gray-700 hover:text-primary-600 p-3 rounded-full transition-all -ml-4"
            aria-label="前へ"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* カードコンテナ */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2 items-stretch"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[calc(33.333%-1rem)] min-w-[300px]">
              {item.display_type === "gallery" ? (
                <ImageGalleryCard
                  item={item}
                  onFullscreen={() => onFullscreen(item)}
                />
              ) : (
                <YouTubeCard
                  item={item}
                  onFullscreen={() => onFullscreen(item)}
                />
              )}
            </div>
          ))}
        </div>

        {/* 右矢印 - 常に表示（無限ループ） */}
        {showButtons && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg text-gray-700 hover:text-primary-600 p-3 rounded-full transition-all -mr-4"
            aria-label="次へ"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

// YouTube URLからembed用のURLを生成
function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  return null;
}

// フルスクリーンモーダルコンポーネント
function FullscreenModal({
  item,
  onClose,
}: {
  item: PortfolioItem;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = item.images || [];
  const isGallery = item.display_type === "gallery";
  const embedUrl = item.youtube_url ? getYoutubeEmbedUrl(item.youtube_url) : null;

  const goToPrevious = useCallback(() => {
    if (isGallery && images.length > 1) {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  }, [isGallery, images.length]);

  const goToNext = useCallback(() => {
    if (isGallery && images.length > 1) {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  }, [isGallery, images.length]);

  // スワイプ: 左スワイプで次へ、右スワイプで前へ
  const swipeHandlers = useSwipe(goToNext, goToPrevious);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goToPrevious, goToNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="閉じる"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* タイトル */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <h3 className="text-xl font-semibold">{item.title}</h3>
        {item.category && (
          <span className="text-sm text-gray-300">{item.category.name}</span>
        )}
      </div>

      {/* コンテンツ */}
      <div
        className="relative w-full max-w-6xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isGallery ? (
          <>
            {/* 画像ギャラリー */}
            <div
              className="relative aspect-video bg-black rounded-lg overflow-hidden touch-pan-y"
              onTouchStart={swipeHandlers.onTouchStart}
              onTouchMove={swipeHandlers.onTouchMove}
              onTouchEnd={swipeHandlers.onTouchEnd}
            >
              <Image
                src={images[currentIndex]}
                alt={`${item.title} - ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
                draggable={false}
              />
            </div>

            {/* ナビゲーション（複数画像がある場合） */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="前の画像"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="次の画像"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* ページ番号 */}
                <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* 参照リンク */}
            {item.reference_url && (
              <div className="mt-4 text-center">
                <a
                  href={item.reference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-primary-300 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  サイトを見る
                </a>
              </div>
            )}
          </>
        ) : (
          /* YouTube動画 */
          embedUrl && (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`${embedUrl}?autoplay=1`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          )
        )}

        {/* 説明文 */}
        {item.description && (
          <p className="mt-4 text-white text-center max-w-2xl mx-auto">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

// 画像ギャラリーカード用コンポーネント
function ImageGalleryCard({
  item,
  onFullscreen,
}: {
  item: PortfolioItem;
  onFullscreen: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = item.images || [];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // スワイプ: 左スワイプで次へ、右スワイプで前へ
  const swipeHandlers = useSwipe(goToNext, goToPrevious);

  if (images.length === 0) return null;

  const imageDisplayMode = item.image_display_mode || "cover";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* 画像スライダー */}
      <div
        className="relative w-full pt-[56.25%] bg-gray-100 flex-shrink-0 touch-pan-y"
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchMove={swipeHandlers.onTouchMove}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        <Image
          src={images[currentIndex]}
          alt={`${item.title} - ${currentIndex + 1}`}
          fill
          className={imageDisplayMode === "contain" ? "object-contain" : "object-cover"}
          draggable={false}
        />

        {/* ナビゲーションボタン（複数画像がある場合のみ） */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="前の画像"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="次の画像"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* ページ番号 */}
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* コンテンツ - 固定高さ */}
      <div className="relative p-4 h-[160px] flex flex-col">
        {item.category && (
          <div className="text-xs text-gray-500 mb-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {item.category.name}
            </span>
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
          {item.description || "\u00A0"}
        </p>
        <div className="flex items-center justify-between mt-2">
          {item.reference_url ? (
            <a
              href={item.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              サイトを見る
            </a>
          ) : (
            <span></span>
          )}
          {/* フルスクリーンボタン */}
          <button
            onClick={onFullscreen}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded transition-colors"
            aria-label="フルスクリーンで表示"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// YouTubeカード用コンポーネント
function YouTubeCard({
  item,
  onFullscreen,
}: {
  item: PortfolioItem;
  onFullscreen: () => void;
}) {
  const embedUrl = item.youtube_url ? getYoutubeEmbedUrl(item.youtube_url) : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {embedUrl && (
        <div className="relative w-full pt-[56.25%] flex-shrink-0">
          <iframe
            src={embedUrl}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      )}
      {/* コンテンツ - 固定高さ */}
      <div className="relative p-4 h-[160px] flex flex-col">
        {item.category && (
          <div className="text-xs text-gray-500 mb-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {item.category.name}
            </span>
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
          {item.description || "\u00A0"}
        </p>
        <div className="flex items-center justify-end mt-2">
          {/* フルスクリーンボタン */}
          <button
            onClick={onFullscreen}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded transition-colors"
            aria-label="フルスクリーンで表示"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioGrid({ portfolios, categories }: PortfolioGridProps) {
  const [fullscreenItem, setFullscreenItem] = useState<PortfolioItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // カテゴリ別にポートフォリオをグループ化
  const getPortfoliosByCategory = (categoryId: string) => {
    return portfolios.filter((item) => item.category_id === categoryId);
  };

  // 記事が存在するカテゴリのみをフィルタリング
  const categoriesWithItems = categories.filter(
    (category) => getPortfoliosByCategory(category.id).length > 0
  );

  // セクションへスクロール
  const scrollToSection = (sectionId: string) => {
    setActiveCategory(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      const headerOffset = 100; // ヘッダー分のオフセット
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      {portfolios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            ポートフォリオはまだありません。
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-3 justify-center sticky top-20 bg-white py-4 z-10">
            <button
              onClick={() => scrollToSection("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ALL
            </button>
            {categoriesWithItems.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* ALLセクション（全てのポートフォリオ） */}
          <section ref={(el) => { sectionRefs.current["all"] = el; }}>
            <CarouselSection
              title="ALL"
              items={portfolios}
              onFullscreen={setFullscreenItem}
            />
          </section>

          {/* カテゴリ別セクション（記事があるカテゴリのみ表示） */}
          {categoriesWithItems.map((category) => (
            <section
              key={category.id}
              ref={(el) => { sectionRefs.current[category.id] = el; }}
            >
              <CarouselSection
                title={category.name}
                items={getPortfoliosByCategory(category.id)}
                onFullscreen={setFullscreenItem}
              />
            </section>
          ))}
        </div>
      )}

      {/* フルスクリーンモーダル */}
      {fullscreenItem && (
        <FullscreenModal
          item={fullscreenItem}
          onClose={() => setFullscreenItem(null)}
        />
      )}
    </>
  );
}
