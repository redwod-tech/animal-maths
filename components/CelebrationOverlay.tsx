"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { playCelebrateSound } from "@/lib/sound-effects";
import { ConfettiEffect } from "@/components/ConfettiEffect";

interface CelebrationOverlayProps {
  tokens: number;
  onDismiss: () => void;
}

export function CelebrationOverlay({
  tokens,
  onDismiss,
}: CelebrationOverlayProps) {
  useEffect(() => {
    playCelebrateSound();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onDismiss}
    >
      <ConfettiEffect />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-gradient-to-br from-purple-500 via-pink-400 to-amber-300 rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4 relative z-10"
      >
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
          className="text-5xl font-extrabold text-white mb-4"
        >
          Great Job!
        </motion.p>
        <div className="flex items-center justify-center gap-2 text-white">
          <span className="text-3xl font-bold">+</span>
          <motion.span
            key={tokens}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.3 }}
            className="text-4xl font-extrabold"
          >
            {tokens}
          </motion.span>
          <span className="text-2xl">tokens</span>
        </div>
      </motion.div>
    </div>
  );
}
