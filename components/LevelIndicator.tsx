"use client";

import type { MathSection } from "@/types";
import { SECTIONS } from "@/lib/constants";

interface LevelIndicatorProps {
  level: number;
  consecutiveCorrect: number;
  section: MathSection;
}

const TOTAL_LEVELS = 5;
const CORRECT_TO_LEVEL_UP = 3;

export function LevelIndicator({ level, consecutiveCorrect, section }: LevelIndicatorProps) {
  const sectionData = SECTIONS.find((s) => s.id === section);
  const emoji = sectionData?.emoji ?? "";
  const name = sectionData?.name ?? section;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-lg">{emoji}</span>
      <span className="font-semibold text-arctic-700">{name}</span>

      {/* Level dots */}
      <div className="flex items-center gap-1">
        {Array.from({ length: TOTAL_LEVELS }).map((_, i) => (
          <div
            key={i}
            data-testid="level-dot"
            className={`w-2.5 h-2.5 rounded-full ${
              i < level ? "bg-aurora-green" : "bg-arctic-200"
            }`}
          />
        ))}
      </div>

      {/* Progress pips toward next level */}
      <div className="flex items-center gap-0.5 ml-1">
        {Array.from({ length: CORRECT_TO_LEVEL_UP }).map((_, i) => (
          <div
            key={i}
            data-testid="progress-pip"
            className={`w-1.5 h-1.5 rounded-full ${
              i < consecutiveCorrect ? "bg-gold" : "bg-arctic-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
