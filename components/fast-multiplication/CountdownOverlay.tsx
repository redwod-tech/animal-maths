"use client";

import { motion } from "framer-motion";

interface CountdownOverlayProps {
  count: number;
}

export function CountdownOverlay({ count }: CountdownOverlayProps) {
  const display = count === 0 ? "GO!" : String(count);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        key={display}
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-8xl font-bold text-white drop-shadow-lg"
      >
        {display}
      </motion.div>
    </div>
  );
}
