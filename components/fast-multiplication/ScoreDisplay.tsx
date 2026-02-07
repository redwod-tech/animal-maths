"use client";

import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-500">Score</p>
      <motion.span
        key={score}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="text-3xl font-bold text-arctic-800"
      >
        {score}
      </motion.span>
    </div>
  );
}
