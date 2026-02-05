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
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  // ラインの幅を計算（ResizeObserverで要素サイズ変更を監視）
  useEffect(() => {
    const titleEl = titleRef.current;
    const lineEl = lineRef.current;
    if (!titleEl || !lineEl) return;

    const updateLineWidth = () => {
      if (isVisible) {
        lineEl.style.width = `${titleEl.offsetWidth}px`;
      } else {
        lineEl.style.width = "0px";
      }
    };

    updateLineWidth();

    const resizeObserver = new ResizeObserver(updateLineWidth);
    resizeObserver.observe(titleEl);

    return () => resizeObserver.disconnect();
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
