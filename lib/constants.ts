import type { ShopItemData, SectionData, RewardAmounts, CosmeticCategory } from "@/types";

export const SHOP_ITEMS: ShopItemData[] = [
  // Hats
  {
    id: "arctic-explorer-hat",
    name: "Arctic Explorer Hat",
    cost: 5,
    category: "hat",
    emoji: "🧊",
  },
  {
    id: "polar-bear-hat",
    name: "Polar Bear Hat",
    cost: 8,
    category: "hat",
    emoji: "🐻‍❄️",
  },
  {
    id: "narwhal-horn",
    name: "Narwhal Horn",
    cost: 12,
    category: "hat",
    emoji: "🦄",
  },
  {
    id: "ice-crown",
    name: "Ice Crown",
    cost: 15,
    category: "hat",
    emoji: "👑",
  },
  {
    id: "santa-hat",
    name: "Santa Hat",
    cost: 6,
    category: "hat",
    emoji: "🎅",
  },
  // Scarves
  {
    id: "snowflake-scarf",
    name: "Snowflake Scarf",
    cost: 4,
    category: "scarf",
    emoji: "❄️",
  },
  {
    id: "aurora-scarf",
    name: "Aurora Scarf",
    cost: 6,
    category: "scarf",
    emoji: "🌈",
  },
  {
    id: "fire-scarf",
    name: "Fire Scarf",
    cost: 8,
    category: "scarf",
    emoji: "🔥",
  },
  {
    id: "star-scarf",
    name: "Star Scarf",
    cost: 5,
    category: "scarf",
    emoji: "⭐",
  },
  // Accessories
  {
    id: "cool-shades",
    name: "Cool Shades",
    cost: 8,
    category: "accessory",
    emoji: "🕶️",
  },
  {
    id: "bow-tie",
    name: "Bow Tie",
    cost: 6,
    category: "accessory",
    emoji: "🎀",
  },
  {
    id: "gold-medal",
    name: "Gold Medal",
    cost: 10,
    category: "accessory",
    emoji: "🏅",
  },
  // Backgrounds
  {
    id: "northern-lights",
    name: "Northern Lights",
    cost: 10,
    category: "background",
    emoji: "🌌",
    bgStyle: "bg-gradient-to-b from-indigo-900 via-purple-700 to-teal-500",
  },
  {
    id: "snowy-mountain",
    name: "Snowy Mountain",
    cost: 7,
    category: "background",
    emoji: "🏔️",
    bgStyle: "bg-gradient-to-br from-white via-sky-200 to-slate-400",
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    cost: 12,
    category: "background",
    emoji: "✨",
    bgStyle: "bg-gradient-to-t from-green-400 via-teal-500 to-indigo-800",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    cost: 11,
    category: "background",
    emoji: "🌊",
    bgStyle: "bg-gradient-to-b from-blue-900 via-blue-600 to-cyan-400",
  },
  {
    id: "starry-night",
    name: "Starry Night",
    cost: 14,
    category: "background",
    emoji: "🌠",
    bgStyle: "bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-800",
  },
];

export const SECTIONS: SectionData[] = [
  {
    id: "addition",
    name: "Addition",
    emoji: "➕",
    description: "Practice adding numbers together",
  },
  {
    id: "subtraction",
    name: "Subtraction",
    emoji: "➖",
    description: "Practice taking numbers away",
  },
  {
    id: "multiplication",
    name: "Multiplication",
    emoji: "✖️",
    description: "Practice multiplying numbers",
  },
  {
    id: "skip-counting",
    name: "Skip Counting",
    emoji: "🔢",
    description: "Practice counting by 2s, 5s, and 10s",
  },
  {
    id: "area-perimeter",
    name: "Area & Perimeter",
    emoji: "📐",
    description: "Calculate area and perimeter of shapes",
  },
];

export const CATEGORY_ORDER: CosmeticCategory[] = ["hat", "scarf", "accessory", "background"];

export const CATEGORY_LABELS: Record<CosmeticCategory, string> = {
  hat: "Hats",
  scarf: "Scarves",
  accessory: "Accessories",
  background: "Backgrounds",
};

export function getShopItemById(id: string): ShopItemData | undefined {
  return SHOP_ITEMS.find((item) => item.id === id);
}

export const REWARD_AMOUNTS: RewardAmounts = {
  firstTry: 3,
  retry: 1,
};

export const SPOKEN_ENCOURAGEMENTS: string[] = [
  "Great job!",
  "Amazing!",
  "You're a star!",
  "Brilliant!",
  "Keep it up!",
];
