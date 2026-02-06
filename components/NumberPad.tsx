"use client";

import { motion } from "framer-motion";

interface NumberPadProps {
  onDigit: (digit: number) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

const BTN_BASE =
  "min-h-16 rounded-xl text-2xl font-bold transition-transform disabled:opacity-50";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NumberPad({
  onDigit,
  onBackspace,
  onSubmit,
  disabled = false,
}: NumberPadProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto"
    >
      {DIGITS.map((digit) => (
        <motion.button
          key={digit}
          variants={item}
          whileTap={{ scale: 0.92 }}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(digit)}
          className={`${BTN_BASE} bg-gradient-to-b from-white to-arctic-100 text-arctic-900 shadow-[0_4px_0_0] shadow-arctic-300`}
        >
          {digit}
        </motion.button>
      ))}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.92 }}
        type="button"
        disabled={disabled}
        onClick={onBackspace}
        aria-label="Backspace"
        className={`${BTN_BASE} bg-gradient-to-b from-white to-arctic-100 text-arctic-900 shadow-[0_4px_0_0] shadow-arctic-300`}
      >
        ⌫
      </motion.button>
      <motion.button
        variants={item}
        whileTap={{ scale: 0.92 }}
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        aria-label="Submit"
        className={`${BTN_BASE} bg-gradient-to-b from-aurora-green to-green-500 text-white shadow-[0_4px_0_0] shadow-green-700 submit-glow`}
      >
        ✓
      </motion.button>
    </motion.div>
  );
}
