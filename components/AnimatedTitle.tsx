"use client";

import { useId } from "react";

interface AnimatedTitleProps {
  text: string;
  className?: string;
  highlightColor?: string;
  duration?: number;
}

export default function AnimatedTitle({
  text,
  className = "",
  highlightColor = "#393D45",
  duration = 2000,
}: AnimatedTitleProps) {
  const id = useId().replace(/:/g, "");
  const characters = text.split("");
  const durationSec = (duration / 1000) * characters.length;

  // 各文字にランダムなディレイを事前計算（SSRと一致させるためseedベース）
  const delays = characters.map((_, i) => {
    // 文字ごとに異なるディレイ（0〜durationSec秒の範囲）
    return ((i * 7 + 3) % characters.length) / characters.length * durationSec;
  });

  return (
    <>
      <style>{`
        @keyframes charHighlight-${id} {
          0%, 85%, 100% { color: #FBFDFF; }
          10%, 20% { color: ${highlightColor}; }
        }
      `}</style>
      <h1 className={className}>
        {characters.map((char, index) => {
          if (char === "|") {
            return <br key={index} className="md:hidden" />;
          }

          const isAnimatable = char !== " " && char !== "、";

          return (
            <span
              key={index}
              className="inline-block"
              style={isAnimatable ? {
                color: "#FBFDFF",
                animation: `charHighlight-${id} ${durationSec}s ease-in-out ${delays[index]}s infinite`,
              } : {
                color: "#FBFDFF",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </h1>
    </>
  );
}
