"use client";

import { motion } from "framer-motion";
import { ConfettiEffect } from "@/components/ConfettiEffect";

interface RoundEndProps {
  score: number;
  totalAnswered: number;
  correctCount: number;
  bestStreak: number;
  isNewBest: boolean;
  tokensEarned: number;
  onContinue: () => void;
}

export function RoundEnd({
  score,
  totalAnswered,
  correctCount,
  bestStreak,
  isNewBest,
  tokensEarned,
  onContinue,
}: RoundEndProps) {
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="relative flex flex-col items-center gap-6 w-full max-w-md mx-auto py-8">
      {isNewBest && <ConfettiEffect />}

      {isNewBest && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="text-2xl font-bold text-yellow-500"
        >
          New Best!
        </motion.p>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <p className="text-lg text-gray-500">Score</p>
        <p className="text-6xl font-bold text-arctic-800">{score}</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 text-center w-full">
        <div>
          <p className="text-sm text-gray-500">Accuracy</p>
          <p className="text-2xl font-bold text-arctic-700">{accuracy}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Best Streak</p>
          <p className="text-2xl font-bold text-orange-500">{bestStreak}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tokens</p>
          <p className="text-2xl font-bold text-yellow-500">+{tokensEarned} tokens</p>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-4 px-8 py-3 rounded-xl bg-arctic-700 text-white font-bold text-lg hover:bg-arctic-800 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
