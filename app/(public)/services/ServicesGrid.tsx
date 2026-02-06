"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import type { ServiceItem, Category } from "@/lib/supabase-data";

interface ServicesGridProps {
  services: ServiceItem[];
  categories: Category[];
}

const ITEMS_PER_PAGE = 6;

export default function ServicesGrid({ services, categories }: ServicesGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLから初期値を取得
  const initialCategory = searchParams.get("category") || null;
  const initialPage = Number.parseInt(searchParams.get("page") || "1", 10);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // カテゴリでフィルタリング
  const filteredServices = useMemo(() => {
    if (!selectedCategory) return services;
    return services.filter(item => item.categories?.includes(selectedCategory));
  }, [services, selectedCategory]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const serviceItems = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // URL同期
  const updateUrl = useCallback((category: string | null, page: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", page.toString());
    const queryString = params.toString();
    router.push(queryString ? `/services?${queryString}` : "/services", { scroll: false });
  }, [router]);

  // カテゴリ変更
  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrl(category, 1);
  }, [updateUrl]);

  // ページ変更
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateUrl(selectedCategory, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, updateUrl]);

  // ページ番号リスト生成
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage <= 3) {
        for (let i = 2; i <= Math.min(showPages, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        for (let i = Math.max(2, totalPages - showPages + 1); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <span className="text-sm font-medium text-gray-600">カテゴリで絞り込み:</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  すべて
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.name
                        ? "text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                    style={selectedCategory === category.name ? { backgroundColor: category.color } : {}}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory && (
            <div className="mb-8">
              <p className="text-gray-600">
                「<span className="font-medium">{selectedCategory}</span>」のサービスを表示中
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="ml-2 text-primary-600 hover:underline text-sm"
                >
                  フィルターを解除
                </button>
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            {serviceItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategory
                    ? `「${selectedCategory}」カテゴリのサービスはありません。`
                    : "サービスはありません。"
                  }
                </p>
              </div>
            ) : (
              serviceItems.map((service) => (
                <ServiceCard
                  key={service.id}
                  imageSrc={service.image}
                  categories={service.categories}
                  title={service.title}
                  description={service.description}
                  href={`/services/${service.slug || service.id}`}
                  imageDisplayMode={service.image_display_mode}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center space-x-2 mt-12">
              {/* Previous button */}
              {currentPage > 1 ? (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  前へ
                </button>
              ) : (
                <span className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed">
                  前へ
                </span>
              )}

              {/* Page numbers */}
              <div className="flex space-x-2">
                {getPageNumbers().map((page, index) => {
                  if (page === "...") {
                    return (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  const pageNum = page as number;
                  const isActive = pageNum === currentPage;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg text-center transition-colors ${
                        isActive
                          ? "bg-primary-600 text-white font-medium"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              {currentPage < totalPages ? (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  次へ
                </button>
              ) : (
                <span className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed">
                  次へ
                </span>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
