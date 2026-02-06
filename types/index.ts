export type MathSection = "addition" | "subtraction" | "multiplication" | "skip-counting";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface DifficultyState {
  level: DifficultyLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}

export interface Problem {
  question: string;
  answer: number;
  hint?: string;
}

export interface ExplanationResponse {
  steps: string[];
  encouragement: string;
}

export type CosmeticCategory = "hat" | "scarf" | "background";

export interface ShopItemData {
  id: string;
  name: string;
  cost: number;
  category: CosmeticCategory;
  emoji: string;
}

export interface SectionData {
  id: MathSection;
  name: string;
  emoji: string;
  description: string;
}

export interface SessionData {
  userName: string;
  tokens: number;
  purchasedItems: string[];
  equipped: Record<CosmeticCategory, string | null>;
  sections: Record<MathSection, DifficultyState>;
}

export type PlayState =
  | "LOADING"
  | "ANSWERING"
  | "CORRECT"
  | "FIRST_WRONG"
  | "WRONG"
  | "RETRYING"
  | "EXPLAINING";

export interface RewardAmounts {
  firstTry: number;
  retry: number;
}
