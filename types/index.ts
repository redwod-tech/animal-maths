export type MathSection = "addition" | "subtraction" | "multiplication" | "skip-counting" | "area-perimeter";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface DifficultyState {
  level: DifficultyLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}

export type ShapeType = "rectangle" | "square" | "triangle" | "l-shape";

export interface ShapeData {
  type: ShapeType;
  dimensions: Record<string, number>;
  questionType: "area" | "perimeter";
}

export interface Problem {
  question: string;
  answer: number;
  hint?: string;
  shape?: ShapeData;
}

export interface ExplanationResponse {
  steps: string[];
  encouragement: string;
}

export type CosmeticCategory = "hat" | "scarf" | "background" | "accessory";

export interface ShopItemData {
  id: string;
  name: string;
  cost: number;
  category: CosmeticCategory;
  emoji: string;
  bgStyle?: string;
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
