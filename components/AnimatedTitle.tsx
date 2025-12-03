"use client";

import { useEffect, useState } from "react";

interface AnimatedTitleProps {
  text: string;
  className?: string;
  highlightColor?: string;
  duration?: number; // 1文字あたりの表示時間（ミリ秒）
}

export default function AnimatedTitle({
  text,
  className = "",
  highlightColor = "text-[#393D45]",
  duration = 2000, // デフォルト2000ms（より遅い速度）
}: AnimatedTitleProps) {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const characters = text.split("");

  useEffect(() => {
    const getRandomIndices = (): number[] => {
      const indices: number[] = [];
      const availableIndices = characters
        .map((_, index) => index)
        .filter((index) =>
          characters[index] !== " " &&
          characters[index] !== "、" &&
          characters[index] !== "|"
        );

      // 2つのランダムなインデックスを選択
      while (indices.length < 2 && availableIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices[randomIndex];
        if (!indices.includes(selectedIndex)) {
          indices.push(selectedIndex);
        }
        // 無限ループを防ぐため、利用可能なインデックスが少ない場合は終了
        if (availableIndices.length <= indices.length) {
          break;
        }
      }

      return indices;
    };

    // 初回のランダムインデックスを設定
    setActiveIndices(getRandomIndices());

    const interval = setInterval(() => {
      setActiveIndices(getRandomIndices());
    }, duration);

    return () => clearInterval(interval);
  }, [characters.length, duration]);

  return (
    <h1 className={className}>
      {characters.map((char, index) => {
        const isActive = activeIndices.includes(index);

        // 改行文字の処理（|で改行を表現）
        if (char === "|") {
          return <br key={index} className="md:hidden" />;
        }

        return (
          <span
            key={index}
            className={`inline-block transition-all duration-500 ease-in-out ${
              isActive
                ? `${highlightColor}`
                : ""
            }`}
            style={{
              color: isActive ? undefined : "#FBFDFF",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </h1>
  );
}

