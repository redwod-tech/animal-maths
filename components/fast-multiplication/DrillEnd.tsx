"use client";

import { motion } from "framer-motion";

interface DrillEndProps {
  corrected: number;
  total: number;
  onContinue: () => void;
}

export function DrillEnd({ corrected, total, onContinue }: DrillEndProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold text-arctic-800">Drill Complete!</h2>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <p className="text-xl text-gray-600">
          You corrected <span className="font-bold text-green-600">{corrected}</span> of{" "}
          <span className="font-bold text-arctic-700">{total}</span> missed facts
        </p>
      </motion.div>

      {corrected === total && (
        <p className="text-lg text-green-600 font-semibold">Perfect drill!</p>
      )}

      <button
        onClick={onContinue}
        className="mt-4 px-8 py-3 rounded-xl bg-arctic-700 text-white font-bold text-lg hover:bg-arctic-800 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
