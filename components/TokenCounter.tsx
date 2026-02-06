"use client";

import { motion } from "framer-motion";

interface TokenCounterProps {
  tokens: number;
}

export default function TokenCounter({ tokens }: TokenCounterProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "#d4a017",
        fontWeight: "bold",
        fontSize: "1.25rem",
      }}
    >
      <img src="/images/m-token.png" alt="M token" width={28} height={28} />
      <motion.span
        key={tokens}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {tokens}
      </motion.span>
    </div>
  );
}
