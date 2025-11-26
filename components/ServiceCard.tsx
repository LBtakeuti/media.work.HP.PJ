import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  date?: string;
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
}

export default function ServiceCard({
  title,
  description,
  date,
  category,
  imageSrc = "/sevilla-tower-g8a5d080a4_640.jpg",
  imageAlt,
  href,
}: ServiceCardProps) {
  const CardContent = (
    <>
      {/* Image/Visual Section */}
      <div className="relative h-56 bg-gray-100 group-hover:bg-[#E6E6E6] group-active:bg-[#E6E6E6] transition-colors duration-200 overflow-hidden rounded-t-lg">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-contain"
        />
        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-[#E6E6E6] opacity-0 group-hover:opacity-30 group-active:opacity-30 transition-opacity duration-200"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 bg-white group-hover:bg-[#E6E6E6] group-active:bg-[#E6E6E6] transition-colors duration-200">
        {(date || category) && (
          <div className="text-xs text-gray-500 mb-3">
            {date && category ? `${date} | ${category}` : date || category}
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex justify-end">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </>
  );

  const cardClassName = "group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:bg-[#E6E6E6] active:bg-[#E6E6E6] active:scale-[0.98] transition-all duration-200 border border-gray-100 cursor-pointer";

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {CardContent}
      </Link>
    );
  }

  return (
    <div className={cardClassName}>
      {CardContent}
    </div>
  );
}

