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
  const lineRef = useRef<HTMLSpanElement>(null);

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

  // ラインの幅を計算（英語部分まで含める）
  useEffect(() => {
    const updateLineWidth = () => {
      if (titleRef.current && lineRef.current) {
        if (isVisible) {
          // requestAnimationFrameでDOM更新後に幅を取得
          requestAnimationFrame(() => {
            if (titleRef.current && lineRef.current) {
              const fullWidth = titleRef.current.offsetWidth;
              lineRef.current.style.width = `${fullWidth}px`;
            }
          });
        } else {
          lineRef.current.style.width = "0px";
        }
      }
    };

    updateLineWidth();

    // リサイズ時にも更新
    window.addEventListener("resize", updateLineWidth);
    return () => window.removeEventListener("resize", updateLineWidth);
  }, [isVisible]);

  return (
    <h2
      ref={titleRef}
      className={`relative inline-block ${className}`}
    >
      {children}
      <span
        ref={lineRef}
        className="absolute bottom-0 left-0 h-[3px] bg-[#1e3a5f] transition-all duration-700 ease-out"
        style={{ width: "0px" }}
      />
    </h2>
  );
}
