"use client";

import { motion } from "framer-motion";

interface ExplanationCardProps {
  steps: string[];
  encouragement: string;
  onTryAgain: () => void;
  onReadAloud: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const stepVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

export function ExplanationCard({
  steps,
  encouragement,
  onTryAgain,
  onReadAloud,
}: ExplanationCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.img
          initial={{ rotate: -10 }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          src="/images/penguin-teacher.png"
          alt="Penguin teacher"
          className="w-16 h-16"
        />
        <h2 className="text-xl font-bold text-gray-800">Let me explain!</h2>
      </div>

      <ol className="list-none space-y-2 mb-4">
        {steps.map((step, index) => (
          <motion.li
            key={index}
            variants={stepVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.15 * (index + 1) }}
            className="flex items-start gap-2 text-gray-700 text-lg"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            {step}
          </motion.li>
        ))}
      </ol>

      <p className="text-indigo-600 font-semibold text-center mb-6">
        {encouragement}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onReadAloud}
          className="flex-1 min-h-16 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-xl transition-colors"
        >
          Read Aloud
        </button>
        <button
          onClick={onTryAgain}
          className="flex-1 min-h-16 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
}
