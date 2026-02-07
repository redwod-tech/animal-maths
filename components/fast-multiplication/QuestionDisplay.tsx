"use client";

import { motion } from "framer-motion";

interface QuestionDisplayProps {
  text: string;
}

export function QuestionDisplay({ text }: QuestionDisplayProps) {
  return (
    <motion.div
      key={text}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="text-center py-6"
    >
      <span className="text-6xl font-bold text-arctic-900">{text}</span>
    </motion.div>
  );
}
