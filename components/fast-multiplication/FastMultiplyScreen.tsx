"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useSession } from "@/hooks/useSession";
import { useGameTimer } from "@/hooks/useGameTimer";
import {
  getFactPool,
  pickQuestion,
  adjustWeights,
  getMissDrillQuestions,
} from "@/lib/multiplication-engine";
import {
  playCorrectSound,
  playWrongSound,
  playCelebrateSound,
  unlockAudio,
} from "@/lib/sound-effects";
import TokenCounter from "@/components/TokenCounter";
import { ModeSelect } from "./ModeSelect";
import { CountdownOverlay } from "./CountdownOverlay";
import { GamePlay } from "./GamePlay";
import { RoundEnd } from "./RoundEnd";
import { MissDrill } from "./MissDrill";
import { DrillEnd } from "./DrillEnd";
import type {
  FastMultiplyPhase,
  MultiplicationGameMode,
  MultiplicationQuestion,
  WeightedFact,
  MissRecord,
} from "@/types";

const ROUND_TIME = 60;
const DRILL_TIME = 30;

export default function FastMultiplyScreen() {
  const { session, addTokens, updateMultiplicationData } = useSession();
  const multData = session.multiplicationData!;

  const [phase, setPhase] = useState<FastMultiplyPhase>("MODE_SELECT");
  const [mode, setMode] = useState<MultiplicationGameMode>("mixed");
  const [selectedTable, setSelectedTable] = useState<number | undefined>();

  // Game state — use refs for pool to avoid stale closures in callbacks
  const poolRef = useRef<WeightedFact[]>([]);
  const [question, setQuestion] = useState<MultiplicationQuestion>({
    a: 0,
    b: 0,
    answer: 0,
    text: "",
  });
  const questionRef = useRef(question);
  questionRef.current = question;

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const roundMissesRef = useRef<MultiplicationQuestion[]>([]);
  const [roundMissCount, setRoundMissCount] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<{
    text: string;
    answer: number;
  } | null>(null);

  // Countdown state
  const [countdownValue, setCountdownValue] = useState(3);

  // Miss drill state
  const [drillQuestions, setDrillQuestions] = useState<MultiplicationQuestion[]>([]);
  const drillQuestionsRef = useRef<MultiplicationQuestion[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const drillIndexRef = useRef(0);
  drillIndexRef.current = drillIndex;
  const [drillCorrected, setDrillCorrected] = useState(0);
  const [drillWrongFlash, setDrillWrongFlash] = useState<{
    text: string;
    answer: number;
  } | null>(null);

  // Timer
  const timerDuration =
    phase === "PLAYING" ? ROUND_TIME : phase === "MISS_DRILL" ? DRILL_TIME : 0;
  const isTimerRunning = phase === "PLAYING" || phase === "MISS_DRILL";
  const { timeRemaining } = useGameTimer(timerDuration, isTimerRunning);

  // Track if audio unlocked
  const audioUnlocked = useRef(false);

  // Refs for endRound/endDrill to read current state
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const selectedTableRef = useRef(selectedTable);
  selectedTableRef.current = selectedTable;
  const multDataRef = useRef(multData);
  multDataRef.current = multData;

  // Handle timer expiry
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (timeRemaining === 0 && phaseRef.current === "PLAYING") {
      endRound();
    }
    if (timeRemaining === 0 && phaseRef.current === "MISS_DRILL") {
      endDrill();
    }
  }, [timeRemaining]);

  const handleSelectMode = useCallback(
    (selectedMode: MultiplicationGameMode, table?: number) => {
      if (!audioUnlocked.current) {
        unlockAudio();
        audioUnlocked.current = true;
      }
      setMode(selectedMode);
      modeRef.current = selectedMode;
      setSelectedTable(table);
      selectedTableRef.current = table;
      startCountdown(selectedMode, table);
    },
    []
  );

  function startCountdown(
    selectedMode: MultiplicationGameMode,
    table?: number
  ) {
    // Reset game state
    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    roundMissesRef.current = [];
    setRoundMissCount(0);
    setWrongFlash(null);

    // Build fact pool
    const newPool = getFactPool(selectedMode, table, multDataRef.current.missHistory);
    poolRef.current = newPool;
    const firstQ = pickQuestion(newPool);
    setQuestion(firstQ);
    questionRef.current = firstQ;

    // Start countdown 3-2-1-GO
    setCountdownValue(3);
    setPhase("COUNTDOWN");

    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdownValue(count);
      if (count < 0) {
        clearInterval(interval);
        setPhase("PLAYING");
      }
    }, 800);
  }

  const handleAnswer = useCallback((answer: number) => {
    const q = questionRef.current;
    setTotalAnswered((prev) => prev + 1);

    if (answer === q.answer) {
      playCorrectSound();
      setScore((prev) => {
        scoreRef.current = prev + 1;
        return prev + 1;
      });
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
      poolRef.current = adjustWeights(poolRef.current, q, true);
      const nextQ = pickQuestion(poolRef.current);
      setQuestion(nextQ);
      questionRef.current = nextQ;
    } else {
      playWrongSound();
      setStreak(0);
      roundMissesRef.current = [...roundMissesRef.current, q];
      setRoundMissCount((prev) => prev + 1);
      poolRef.current = adjustWeights(poolRef.current, q, false);

      setWrongFlash({ text: q.text, answer: q.answer });
      setTimeout(() => {
        setWrongFlash(null);
        const nextQ = pickQuestion(poolRef.current);
        setQuestion(nextQ);
        questionRef.current = nextQ;
      }, 1000);
    }
  }, []);

  function endRound() {
    const currentScore = scoreRef.current;
    const tokensEarned = Math.floor(currentScore / 3);
    if (tokensEarned > 0) {
      addTokens(tokensEarned);
    }

    const md = multDataRef.current;
    const currentMode = modeRef.current;
    const currentTable = selectedTableRef.current;

    // Update best scores
    const newBestScores = { ...md.bestScores };
    if (currentMode === "single" && currentTable !== undefined) {
      const prevBest = newBestScores.single[currentTable] || 0;
      if (currentScore > prevBest) {
        newBestScores.single = { ...newBestScores.single, [currentTable]: currentScore };
      }
    } else if (currentMode === "mixed") {
      if (currentScore > newBestScores.mixed) {
        newBestScores.mixed = currentScore;
      }
    } else if (currentMode === "boss") {
      if (currentScore > newBestScores.boss) {
        newBestScores.boss = currentScore;
      }
    }

    // Update miss history (cap at 50)
    const newMissRecords: MissRecord[] = roundMissesRef.current.map((m) => ({
      fact: { a: m.a, b: m.b },
      wrongAnswer: 0,
      timestamp: Date.now(),
    }));
    const newMissHistory = [...md.missHistory, ...newMissRecords].slice(-50);

    updateMultiplicationData({
      bestScores: newBestScores,
      missHistory: newMissHistory,
    });

    if (roundMissesRef.current.length > 0) {
      playCelebrateSound();
    }

    setPhase("ROUND_END");
  }

  function handleRoundEndContinue() {
    if (roundMissesRef.current.length > 0) {
      const drillQs = getMissDrillQuestions(roundMissesRef.current);
      setDrillQuestions(drillQs);
      drillQuestionsRef.current = drillQs;
      setDrillIndex(0);
      drillIndexRef.current = 0;
      setDrillCorrected(0);
      setDrillWrongFlash(null);

      setCountdownValue(3);
      setPhase("COUNTDOWN");
      let count = 3;
      const interval = setInterval(() => {
        count--;
        setCountdownValue(count);
        if (count < 0) {
          clearInterval(interval);
          setPhase("MISS_DRILL");
        }
      }, 800);
    } else {
      playCelebrateSound();
      setPhase("MODE_SELECT");
    }
  }

  const handleDrillAnswer = useCallback((answer: number) => {
    const dqs = drillQuestionsRef.current;
    const idx = drillIndexRef.current;
    const currentQ = dqs[idx];
    if (!currentQ) return;

    if (answer === currentQ.answer) {
      playCorrectSound();
      setDrillCorrected((prev) => prev + 1);
      if (idx + 1 >= dqs.length) {
        endDrill();
      } else {
        const nextIdx = idx + 1;
        setDrillIndex(nextIdx);
        drillIndexRef.current = nextIdx;
      }
    } else {
      playWrongSound();
      setDrillWrongFlash({ text: currentQ.text, answer: currentQ.answer });
      setTimeout(() => {
        setDrillWrongFlash(null);
      }, 1000);
    }
  }, []);

  function endDrill() {
    setPhase("DRILL_END");
  }

  function handleDrillEndContinue() {
    setPhase("MODE_SELECT");
  }

  // Compute isNewBest (uses current render state, fine for display)
  const isNewBest = (() => {
    if (mode === "single" && selectedTable !== undefined) {
      const prev = multData.bestScores.single[selectedTable] || 0;
      return score > prev;
    } else if (mode === "mixed") {
      return score > multData.bestScores.mixed;
    } else if (mode === "boss") {
      return score > multData.bestScores.boss;
    }
    return false;
  })();

  const tokensEarned = Math.floor(score / 3);

  return (
    <main className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 py-6">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <Link
          href="/"
          className="text-arctic-700 font-semibold hover:underline"
        >
          &larr; Back
        </Link>
        <TokenCounter tokens={session.tokens} />
      </div>

      <AnimatePresence mode="wait">
        {phase === "MODE_SELECT" && (
          <ModeSelect
            bestScores={multData.bestScores}
            missHistoryCount={multData.missHistory.length}
            onSelectMode={handleSelectMode}
          />
        )}

        {phase === "COUNTDOWN" && <CountdownOverlay count={countdownValue} />}

        {phase === "PLAYING" && (
          <GamePlay
            question={question}
            timeRemaining={timeRemaining}
            totalTime={ROUND_TIME}
            score={score}
            streak={streak}
            wrongFlash={wrongFlash}
            onAnswer={handleAnswer}
          />
        )}

        {phase === "ROUND_END" && (
          <RoundEnd
            score={score}
            totalAnswered={totalAnswered}
            correctCount={correctCount}
            bestStreak={bestStreak}
            isNewBest={isNewBest}
            tokensEarned={tokensEarned}
            onContinue={handleRoundEndContinue}
          />
        )}

        {phase === "MISS_DRILL" && (
          <MissDrill
            questions={drillQuestions}
            timeRemaining={timeRemaining}
            totalTime={DRILL_TIME}
            currentIndex={drillIndex}
            wrongFlash={drillWrongFlash}
            onAnswer={handleDrillAnswer}
          />
        )}

        {phase === "DRILL_END" && (
          <DrillEnd
            corrected={drillCorrected}
            total={drillQuestions.length}
            onContinue={handleDrillEndContinue}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
