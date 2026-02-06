import type { ShopItemData, SectionData, RewardAmounts } from "@/types";

export const SHOP_ITEMS: ShopItemData[] = [
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
    id: "northern-lights",
    name: "Northern Lights",
    cost: 10,
    category: "background",
    emoji: "🌌",
  },
  {
    id: "snowy-mountain",
    name: "Snowy Mountain",
    cost: 7,
    category: "background",
    emoji: "🏔️",
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
];

export const REWARD_AMOUNTS: RewardAmounts = {
  firstTry: 3,
  retry: 1,
};
