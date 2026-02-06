import { DifficultyLevel, DifficultyState } from "@/types";

const PROMOTE_THRESHOLD = 5;
const DEMOTE_THRESHOLD = 3;
const MAX_LEVEL: DifficultyLevel = 5;
const MIN_LEVEL: DifficultyLevel = 1;

export function updateDifficulty(
  state: DifficultyState,
  isCorrect: boolean
): DifficultyState {
  if (isCorrect) {
    const newCorrect = state.consecutiveCorrect + 1;
    const shouldPromote = newCorrect >= PROMOTE_THRESHOLD && state.level < MAX_LEVEL;

    return {
      level: shouldPromote ? ((state.level + 1) as DifficultyLevel) : state.level,
      consecutiveCorrect: shouldPromote ? 0 : newCorrect,
      consecutiveWrong: 0,
    };
  }

  const newWrong = state.consecutiveWrong + 1;
  const shouldDemote = newWrong >= DEMOTE_THRESHOLD && state.level > MIN_LEVEL;

  return {
    level: shouldDemote ? ((state.level - 1) as DifficultyLevel) : state.level,
    consecutiveCorrect: 0,
    consecutiveWrong: shouldDemote ? 0 : newWrong,
  };
}
