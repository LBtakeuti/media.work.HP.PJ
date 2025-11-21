import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/lib/data";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <Link
      href={`/news/${item.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group"
    >
      {/* Image Section */}
      <div className="relative h-56 bg-gray-50">
        <Image
          src={item.image || "/sevilla-tower-g8a5d080a4_640.jpg"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-5 bg-white">
        <div className="text-xs text-gray-500 mb-3">
          {format(new Date(item.date), "yyyy年MM月dd日", {
            locale: ja,
          })}
        </div>
        <div className="text-xs text-gray-600 mb-3">
          {item.category}
        </div>
        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4 line-clamp-3 group-hover:text-primary-600 transition-colors">
          {item.title}
        </h3>
        <div className="flex justify-end">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

