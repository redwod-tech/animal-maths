"use client";

import { motion } from "framer-motion";

interface WrongFlashProps {
  text: string;
  correctAnswer: number;
}

export function WrongFlash({ text, correctAnswer }: WrongFlashProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-6"
    >
      <p className="text-4xl font-bold text-red-500">
        {text} = {correctAnswer}
      </p>
    </motion.div>
  );
}
