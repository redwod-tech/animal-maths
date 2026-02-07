import type { SessionData, MultiplicationSessionData } from "@/types";

export const SESSION_KEY = "animal-maths-session";

export function defaultMultiplicationData(): MultiplicationSessionData {
  return {
    bestScores: { single: {}, mixed: 0, boss: 0 },
    missHistory: [],
  };
}

export function defaultSession(): SessionData {
  return {
    userName: "",
    tokens: 0,
    purchasedItems: [],
    equipped: { hat: null, scarf: null, background: null, accessory: null },
    sections: {
      addition: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
      subtraction: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
      multiplication: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
      "skip-counting": { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
      "area-perimeter": { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
    },
    multiplicationData: defaultMultiplicationData(),
  };
}

export function getSession(): SessionData {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw === null) {
      return defaultSession();
    }
    const defaults = defaultSession();
    const stored = JSON.parse(raw);
    const defaultMult = defaultMultiplicationData();
    const storedMult = stored.multiplicationData;
    return {
      ...defaults,
      ...stored,
      equipped: { ...defaults.equipped, ...stored.equipped },
      sections: { ...defaults.sections, ...stored.sections },
      multiplicationData: storedMult
        ? {
            bestScores: {
              ...defaultMult.bestScores,
              ...storedMult.bestScores,
              single: { ...storedMult.bestScores?.single },
            },
            missHistory: storedMult.missHistory ?? defaultMult.missHistory,
          }
        : defaultMult,
    };
  } catch {
    return defaultSession();
  }
}

export function saveSession(session: SessionData): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function resetSession(): SessionData {
  localStorage.removeItem(SESSION_KEY);
  return defaultSession();
}
