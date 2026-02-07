"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import NumberPad from "@/components/NumberPad";
import { TimerBar } from "./TimerBar";
import { QuestionDisplay } from "./QuestionDisplay";
import { WrongFlash } from "./WrongFlash";
import type { MultiplicationQuestion } from "@/types";

interface MissDrillProps {
  questions: MultiplicationQuestion[];
  timeRemaining: number;
  totalTime: number;
  currentIndex: number;
  wrongFlash: { text: string; answer: number } | null;
  onAnswer: (answer: number) => void;
}

export function MissDrill({
  questions,
  timeRemaining,
  totalTime,
  currentIndex,
  wrongFlash,
  onAnswer,
}: MissDrillProps) {
  const [input, setInput] = useState("");
  const question = questions[currentIndex];

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

  if (!question) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <p className="text-lg font-semibold text-orange-500">
        Miss Drill ({currentIndex + 1}/{questions.length})
      </p>

      <TimerBar timeRemaining={timeRemaining} totalTime={totalTime} />

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

      <div className="text-center min-h-[3rem]">
        <span className="text-4xl font-bold text-arctic-700">
          {input || "?"}
        </span>
      </div>

      <NumberPad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        disabled={wrongFlash !== null}
      />
    </div>
  );
}
