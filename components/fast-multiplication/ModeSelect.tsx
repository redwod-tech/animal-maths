"use client";

import { motion } from "framer-motion";
import type { MultiplicationGameMode, MultiplicationSessionData } from "@/types";

interface ModeSelectProps {
  bestScores: MultiplicationSessionData["bestScores"];
  missHistoryCount: number;
  onSelectMode: (mode: MultiplicationGameMode, table?: number) => void;
}

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];

export function ModeSelect({ bestScores, missHistoryCount, onSelectMode }: ModeSelectProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-4">
      <h2 className="text-2xl font-bold text-arctic-800">Fast Multiplication</h2>
      <p className="text-gray-500 text-center">Pick a mode to start your 60-second drill!</p>

      {/* Single table picker */}
      <div className="w-full">
        <h3 className="text-lg font-semibold text-arctic-700 mb-2">Single Table</h3>
        <div className="grid grid-cols-4 gap-2">
          {TABLES.map((t) => (
            <motion.button
              key={t}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectMode("single", t)}
              className="flex flex-col items-center py-3 px-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <span className="text-2xl font-bold text-arctic-800">×{t}</span>
              {bestScores.single[t] ? (
                <span className="text-xs text-gray-500">Best: {bestScores.single[t]}</span>
              ) : null}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mixed mode */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectMode("mixed")}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Mixed Tables
        {bestScores.mixed > 0 && (
          <span className="block text-sm font-normal opacity-80">Best: {bestScores.mixed}</span>
        )}
      </motion.button>

      {/* Boss mode */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectMode("boss")}
        disabled={missHistoryCount === 0}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Boss Mode
        {missHistoryCount === 0 ? (
          <span className="block text-sm font-normal opacity-80">Get some wrong first!</span>
        ) : (
          <>
            {bestScores.boss > 0 && (
              <span className="block text-sm font-normal opacity-80">Best: {bestScores.boss}</span>
            )}
          </>
        )}
      </motion.button>
    </div>
  );
}
