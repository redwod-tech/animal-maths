import type {
  MultiplicationGameMode,
  MissRecord,
  WeightedFact,
  MultiplicationQuestion,
} from "@/types";

const MAX_WEIGHT = 8;
const MISS_WEIGHT_MULTIPLIER = 2;
const CORRECT_WEIGHT_DECAY = 0.7;

export function getFactPool(
  mode: MultiplicationGameMode,
  table?: number,
  missHistory: MissRecord[] = []
): WeightedFact[] {
  let facts: WeightedFact[];

  if (mode === "boss") {
    // Deduplicate missHistory facts
    const seen = new Set<string>();
    facts = [];
    for (const miss of missHistory) {
      const key = `${miss.fact.a}x${miss.fact.b}`;
      if (!seen.has(key)) {
        seen.add(key);
        facts.push({
          a: miss.fact.a,
          b: miss.fact.b,
          answer: miss.fact.a * miss.fact.b,
          weight: 1,
        });
      }
    }
  } else if (mode === "single" && table !== undefined) {
    facts = Array.from({ length: 10 }, (_, i) => ({
      a: table,
      b: i + 1,
      answer: table * (i + 1),
      weight: 1,
    }));
  } else {
    // mixed: tables 2-9 × 1-10
    facts = [];
    for (let a = 2; a <= 9; a++) {
      for (let b = 1; b <= 10; b++) {
        facts.push({ a, b, answer: a * b, weight: 1 });
      }
    }
  }

  // Apply initial weights from missHistory
  if (missHistory.length > 0) {
    const missCounts = new Map<string, number>();
    for (const miss of missHistory) {
      const key = `${miss.fact.a}x${miss.fact.b}`;
      missCounts.set(key, (missCounts.get(key) || 0) + 1);
    }
    for (const fact of facts) {
      const key = `${fact.a}x${fact.b}`;
      const count = missCounts.get(key) || 0;
      if (count > 0) {
        fact.weight = Math.min(MAX_WEIGHT, Math.pow(MISS_WEIGHT_MULTIPLIER, count));
      }
    }
  }

  return facts;
}

export function pickQuestion(pool: WeightedFact[]): MultiplicationQuestion {
  const totalWeight = pool.reduce((sum, f) => sum + f.weight, 0);
  let random = Math.random() * totalWeight;
  for (const fact of pool) {
    random -= fact.weight;
    if (random <= 0) {
      return {
        a: fact.a,
        b: fact.b,
        answer: fact.answer,
        text: `${fact.a} × ${fact.b}`,
      };
    }
  }
  // Fallback to last fact
  const last = pool[pool.length - 1];
  return {
    a: last.a,
    b: last.b,
    answer: last.answer,
    text: `${last.a} × ${last.b}`,
  };
}

export function adjustWeights(
  pool: WeightedFact[],
  fact: { a: number; b: number },
  isCorrect: boolean
): WeightedFact[] {
  return pool.map((f) => {
    if (f.a === fact.a && f.b === fact.b) {
      if (isCorrect) {
        return { ...f, weight: Math.max(1, f.weight * CORRECT_WEIGHT_DECAY) };
      } else {
        return { ...f, weight: Math.min(MAX_WEIGHT, f.weight * MISS_WEIGHT_MULTIPLIER) };
      }
    }
    return f;
  });
}

export function getMissDrillQuestions(
  roundMisses: MultiplicationQuestion[],
  max: number = 10
): MultiplicationQuestion[] {
  const seen = new Set<string>();
  const unique: MultiplicationQuestion[] = [];
  for (const miss of roundMisses) {
    const key = `${miss.a}x${miss.b}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(miss);
    }
  }
  return unique.slice(0, max);
}
