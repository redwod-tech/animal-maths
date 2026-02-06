"use client";

import { motion } from "framer-motion";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  if (streak === 0) return null;

  const flameCount = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
  const isHot = streak >= 5;

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-1">
        {Array.from({ length: flameCount }).map((_, i) => (
          <span key={i} data-testid="flame" className="text-lg">
            🔥
          </span>
        ))}
        <motion.span
          key={streak}
          initial={{ scale: 1.4, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`font-semibold ${isHot ? "text-orange-500 streak-glow" : "text-arctic-700"}`}
        >
          Streak: {streak}
        </motion.span>
      </div>
    </div>
  );
}
