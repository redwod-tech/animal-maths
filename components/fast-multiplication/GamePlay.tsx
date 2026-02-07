"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import NumberPad from "@/components/NumberPad";
import { StreakCounter } from "@/components/StreakCounter";
import { TimerBar } from "./TimerBar";
import { QuestionDisplay } from "./QuestionDisplay";
import { ScoreDisplay } from "./ScoreDisplay";
import { WrongFlash } from "./WrongFlash";
import type { MultiplicationQuestion } from "@/types";

interface GamePlayProps {
  question: MultiplicationQuestion;
  timeRemaining: number;
  totalTime: number;
  score: number;
  streak: number;
  wrongFlash: { text: string; answer: number } | null;
  onAnswer: (answer: number) => void;
}

export function GamePlay({
  question,
  timeRemaining,
  totalTime,
  score,
  streak,
  wrongFlash,
  onAnswer,
}: GamePlayProps) {
  const [input, setInput] = useState("");

  const handleDigit = useCallback((digit: number) => {
    setInput((prev) => prev + String(digit));
  }, []);

  const handleBackspace = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (input.length === 0) return;
    const answer = parseInt(input, 10);
    onAnswer(answer);
    setInput("");
  }, [input, onAnswer]);

  const isDisabled = wrongFlash !== null;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <TimerBar timeRemaining={timeRemaining} totalTime={totalTime} />

      <div className="flex items-center justify-between w-full px-4">
        <ScoreDisplay score={score} />
        <StreakCounter streak={streak} />
      </div>

      <AnimatePresence mode="wait">
        {wrongFlash ? (
          <WrongFlash
            key="wrong"
            text={wrongFlash.text}
            correctAnswer={wrongFlash.answer}
          />
        ) : (
          <QuestionDisplay key={question.text} text={question.text} />
        )}
      </AnimatePresence>

      {/* Answer display */}
      <div className="text-center min-h-[3rem]">
        <span className="text-4xl font-bold text-arctic-700">
          {input || "?"}
        </span>
      </div>

      <NumberPad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        disabled={isDisabled}
      />
    </div>
  );
}
