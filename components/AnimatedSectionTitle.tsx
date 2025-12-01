"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedSectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedSectionTitle({
  children,
  className = "",
}: AnimatedSectionTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  return (
    <h2
      ref={titleRef}
      className={`relative inline-block ${className}`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-[3px] bg-[#1e3a5f] transition-all duration-700 ease-out ${
          isVisible ? "w-full" : "w-0"
        }`}
      />
    </h2>
  );
}
