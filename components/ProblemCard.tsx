"use client";

import { motion } from "framer-motion";
import type { ShapeData } from "@/types";
import { ShapeRenderer } from "@/components/ShapeRenderer";

interface ProblemCardProps {
  question: string;
  answer: string;
  isCorrect?: boolean | null;
  shape?: ShapeData;
}

export function ProblemCard({ question, answer, isCorrect, shape }: ProblemCardProps) {
  const borderClass =
    isCorrect === true
      ? "border-aurora-green bg-green-50"
      : isCorrect === false
        ? "border-red-400 bg-red-50"
        : "border-ice-200";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`rounded-2xl border-2 bg-white/80 backdrop-blur-sm p-6 shadow-xl ring-1 ring-white/50 ${borderClass}`}
    >
      <p className="text-center text-3xl font-bold text-arctic-800">
        {question}
      </p>
      {shape && (
        <div className="flex justify-center my-4">
          <ShapeRenderer shape={shape} />
        </div>
      )}
      <motion.p
        key={answer}
        initial={{ scale: 1.3, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="mt-4 text-center text-5xl font-extrabold text-arctic-900"
      >
        {answer || "?"}
      </motion.p>
    </motion.div>
  );
}
