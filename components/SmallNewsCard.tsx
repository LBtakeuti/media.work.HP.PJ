import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/lib/supabase-data";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface SmallNewsCardProps {
  item: NewsItem;
}

export default function SmallNewsCard({ item }: SmallNewsCardProps) {
  return (
    <Link
      href={`/news/${item.slug || item.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 cursor-pointer h-full"
    >
      {/* Image Section */}
      <div className="relative h-32 bg-gray-100 group-hover:bg-[#E6E6E6] group-active:bg-[#E6E6E6] transition-colors duration-200 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className={item.image_display_mode === "cover" ? "object-cover" : "object-contain"}
            unoptimized={item.image?.startsWith("data:")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-[#E6E6E6] opacity-0 group-hover:opacity-30 group-active:opacity-30 transition-opacity duration-200"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-3 bg-white group-hover:bg-[#E6E6E6] group-active:bg-[#E6E6E6] transition-colors duration-200">
        <div className="text-xs text-gray-500 mb-1">
          {format(new Date(item.date), "yyyy年MM月dd日", {
            locale: ja,
          })}
        </div>
        {item.categories && item.categories.length > 0 && (
          <div className="text-xs text-gray-600 mb-1 flex flex-wrap gap-1">
            {item.categories.map((category, index) => (
              <span key={index} className="bg-gray-100 px-2 py-0.5 rounded">
                {category}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
          {item.title}
        </h3>
        <div className="flex justify-end">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}


