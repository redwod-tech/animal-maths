"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MathSection, PlayState, Problem, ExplanationResponse } from "@/types";
import { useSession } from "@/hooks/useSession";
import { updateDifficulty } from "@/lib/difficulty";
import { REWARD_AMOUNTS } from "@/lib/constants";
import NumberPad from "@/components/NumberPad";
import { ProblemCard } from "@/components/ProblemCard";
import { ExplanationCard } from "@/components/ExplanationCard";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import TokenCounter from "@/components/TokenCounter";
import { speakSteps, stopSpeaking, isSpeechSupported } from "@/lib/tts";

interface PlayScreenProps {
  section: MathSection;
}

export default function PlayScreen({ section }: PlayScreenProps) {
  const { session, addTokens, updateSection } = useSession();

  const [playState, setPlayState] = useState<PlayState>("LOADING");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState("");
  const [streak, setStreak] = useState(0);
  const [isRetry, setIsRetry] = useState(false);
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [rewardTokens, setRewardTokens] = useState(0);
  const [nextLevel, setNextLevel] = useState<number | null>(null);
  const nextProblemRef = useRef<Problem | null>(null);

  const difficulty = session.sections[section];

  const fetchProblem = useCallback(async (level?: number) => {
    setPlayState("LOADING");
    setAnswer("");
    setExplanation(null);

    const useLevel = level ?? difficulty.level;

    try {
      const res = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, level: useLevel }),
      });

      if (!res.ok) throw new Error("Failed to generate problem");

      const data: Problem = await res.json();
      setProblem(data);
      setPlayState("ANSWERING");
    } catch {
      // Stay in loading on error; could add error state later
    }
  }, [section, difficulty.level]);

  const prefetchProblem = useCallback(async (level?: number) => {
    const useLevel = level ?? difficulty.level;
    try {
      const res = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, level: useLevel }),
      });
      if (res.ok) {
        nextProblemRef.current = await res.json();
      }
    } catch {
      // Pre-fetch failure is non-critical
    }
  }, [section, difficulty.level]);

  useEffect(() => {
    fetchProblem();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDigit = useCallback((digit: number) => {
    setAnswer((prev) => prev + String(digit));
  }, []);

  const handleBackspace = useCallback(() => {
    setAnswer((prev) => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!problem || answer === "") return;

    const parsed = parseInt(answer, 10);

    if (parsed === problem.answer) {
      // Correct answer
      const reward = isRetry ? REWARD_AMOUNTS.retry : REWARD_AMOUNTS.firstTry;
      setRewardTokens(reward);
      addTokens(reward);
      setStreak((prev) => prev + 1);

      const newDifficulty = updateDifficulty(difficulty, true);
      updateSection(section, newDifficulty);
      setNextLevel(newDifficulty.level);

      setPlayState("CORRECT");
      prefetchProblem(newDifficulty.level);
    } else if (!isRetry) {
      // First wrong answer — instant retry, no API call
      setStreak(0);
      const newDifficulty = updateDifficulty(difficulty, false);
      updateSection(section, newDifficulty);
      setPlayState("FIRST_WRONG");
    } else {
      // Second wrong answer — call explain API
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: problem.question,
            correctAnswer: problem.answer,
            wrongAnswer: parsed,
          }),
        });

        if (res.ok) {
          const data: ExplanationResponse = await res.json();
          setExplanation(data);
        } else {
          setExplanation({
            steps: ["Let's try again!"],
            encouragement: "You can do it!",
          });
        }
      } catch {
        setExplanation({
          steps: ["Let's try again!"],
          encouragement: "You can do it!",
        });
      }

      setStreak(0);
      const newDifficulty = updateDifficulty(difficulty, false);
      updateSection(section, newDifficulty);

      setPlayState("WRONG");
      prefetchProblem(newDifficulty.level);
    }
  }, [problem, answer, isRetry, difficulty, section, addTokens, updateSection, prefetchProblem]);

  const handleTryAgain = useCallback(() => {
    setAnswer("");
    setExplanation(null);
    setIsRetry(true);
    setPlayState("ANSWERING");
  }, []);

  const handleNextProblem = useCallback(() => {
    setIsRetry(false);
    if (nextProblemRef.current) {
      setProblem(nextProblemRef.current);
      nextProblemRef.current = null;
      setAnswer("");
      setExplanation(null);
      setPlayState("ANSWERING");
    } else {
      fetchProblem();
    }
  }, [fetchProblem]);

  const handleCelebrationDismiss = useCallback(() => {
    setIsRetry(false);
    setNextLevel(null);
    if (nextProblemRef.current) {
      setProblem(nextProblemRef.current);
      nextProblemRef.current = null;
      setAnswer("");
      setExplanation(null);
      setPlayState("ANSWERING");
    } else {
      fetchProblem(nextLevel ?? undefined);
    }
  }, [fetchProblem, nextLevel]);

  const handleReadAloud = useCallback(() => {
    if (isSpeechSupported() && explanation) {
      stopSpeaking();
      speakSteps(explanation.steps);
    }
  }, [explanation]);

  if (playState === "LOADING") {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-ice-100 to-ice-200 flex flex-col items-center justify-center">
        <p className="text-xl text-arctic-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-ice-100 to-ice-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <a href="/" className="text-arctic-700 font-bold text-lg">
          Back
        </a>
        {session.userName && (
          <span className="text-arctic-700 font-semibold">
            {session.userName}
          </span>
        )}
        <TokenCounter tokens={session.tokens} />
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="text-center">
          <span className="text-arctic-700 font-semibold">
            Streak: {streak}
          </span>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        {playState === "ANSWERING" && problem && (
          <>
            <ProblemCard question={problem.question} answer={answer} />
            <NumberPad
              onDigit={handleDigit}
              onBackspace={handleBackspace}
              onSubmit={handleSubmit}
            />
          </>
        )}

        {playState === "FIRST_WRONG" && problem && (
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto text-center">
            <p className="text-2xl font-bold text-orange-500 mb-2">
              Oops! That&apos;s not right.
            </p>
            <p className="text-lg text-gray-700 mb-4">Try again!</p>
            <button
              onClick={handleTryAgain}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {playState === "WRONG" && explanation && (
          <ExplanationCard
            steps={explanation.steps}
            encouragement={explanation.encouragement}
            onTryAgain={handleNextProblem}
            onReadAloud={handleReadAloud}
          />
        )}
      </div>

      {/* Celebration overlay */}
      {playState === "CORRECT" && (
        <CelebrationOverlay
          tokens={rewardTokens}
          onDismiss={handleCelebrationDismiss}
        />
      )}
    </div>
  );
}
