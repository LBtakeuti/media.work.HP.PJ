import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description?: string;
  date?: string;
  categories?: string[];
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  imageDisplayMode?: 'contain' | 'cover';
  size?: 'default' | 'small';
  className?: string;
}

export default function ServiceCard({
  title,
  description,
  date,
  categories,
  imageSrc,
  imageAlt,
  href,
  imageDisplayMode = 'contain',
  size = 'default',
  className = '',
}: ServiceCardProps) {
  const isSmall = size === 'small';

  const CardContent = (
    <>
      {/* Image/Visual Section */}
      <div className={`relative ${isSmall ? 'h-32' : 'h-56'} flex-shrink-0 bg-gray-100 transition-colors duration-200 overflow-hidden`}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className={imageDisplayMode === "cover" ? "object-cover" : "object-contain"}
            unoptimized={imageSrc?.startsWith("data:")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className={`${isSmall ? 'w-10 h-10' : 'w-16 h-16'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-[#E6E6E6] opacity-0 group-hover:opacity-30 group-active:opacity-30 transition-opacity duration-200"></div>
      </div>

      {/* Content Section - fixed height */}
      <div className={`${isSmall ? 'p-3 h-[88px]' : 'p-5 h-[180px]'} flex flex-col transition-colors duration-200 flex-grow`}>
        {date && (
          <div className={`text-xs text-gray-500 ${isSmall ? 'mb-1' : 'mb-3'} flex-shrink-0`}>
            {date}
          </div>
        )}
        {categories && categories.length > 0 && (
          <div className={`text-xs text-gray-600 ${isSmall ? 'mb-1' : 'mb-3'} flex flex-wrap gap-1 flex-shrink-0`}>
            {categories.map((category, index) => (
              <span key={index} className="bg-gray-100 px-2 py-0.5 rounded">
                {category}
              </span>
            ))}
          </div>
        )}
        <h3
          className={`${isSmall ? 'text-sm' : 'text-xl'} font-bold text-gray-900 ${isSmall ? 'mb-1' : 'mb-3'} leading-tight line-clamp-1 flex-shrink-0`}
          title={title}
        >
          {title}
        </h3>
        {description && !isSmall && (
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 flex-shrink-0">
            {description}
          </p>
        )}
        {/* Spacer to push arrow to bottom */}
        <div className="flex-grow"></div>
        <div className="flex justify-end flex-shrink-0">
          <svg className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </>
  );

  const cardClassName = `group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:bg-[#E6E6E6] active:bg-[#E6E6E6] active:scale-[0.98] transition-all duration-200 cursor-pointer h-full flex flex-col ${className}`;

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
