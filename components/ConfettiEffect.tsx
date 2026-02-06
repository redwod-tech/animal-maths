"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = [
  "#4ade80", // green
  "#f472b6", // pink
  "#fbbf24", // gold
  "#38bdf8", // blue
  "#a78bfa", // purple
  "#fb923c", // orange
];

const PARTICLE_COUNT = 25;

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

export function ConfettiEffect() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      rotation: Math.random() * 720 - 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          data-testid="confetti-particle"
          initial={{
            x: `${p.x}vw`,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "100vh",
            rotate: p.rotation,
            opacity: 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.size > 9 ? "50%" : "2px",
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
