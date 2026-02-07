import type { SessionData } from "@/types";

export const SESSION_KEY = "animal-maths-session";

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
  };
}

export function getSession(): SessionData {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw === null) {
      return defaultSession();
    }
    return { ...defaultSession(), ...JSON.parse(raw) };
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
