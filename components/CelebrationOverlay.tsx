"use client";

import { useEffect } from "react";

interface CelebrationOverlayProps {
  tokens: number;
  onDismiss: () => void;
}

export function CelebrationOverlay({
  tokens,
  onDismiss,
}: CelebrationOverlayProps) {
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
      <div className="bg-gradient-to-br from-purple-500 via-pink-400 to-amber-300 rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4">
        <p className="text-5xl font-extrabold text-white mb-4">
          Great Job!
        </p>
        <div className="flex items-center justify-center gap-2 text-white">
          <span className="text-3xl font-bold">+</span>
          <span className="text-4xl font-extrabold">{tokens}</span>
          <span className="text-2xl">tokens</span>
        </div>
      </div>
    </div>
  );
}
