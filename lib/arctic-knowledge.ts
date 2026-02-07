export interface ArcticAnimal {
  id: string;
  name: string;
  emoji: string;
  funFacts: string[];
  habitat: string;
  diet: string;
}

export interface ArcticFact {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: string;
}

export const ARCTIC_ANIMALS: ArcticAnimal[] = [
  {
    id: "emperor-penguin",
    name: "Emperor Penguin",
    emoji: "🐧",
    funFacts: [
      "Emperor penguins are the tallest of all penguins, standing nearly 4 feet tall!",
      "They can hold their breath for over 20 minutes while diving.",
      "Male penguins keep eggs warm on their feet for 2 months without eating.",
    ],
    habitat: "Antarctica",
    diet: "Fish, squid, and krill",
  },
  {
    id: "polar-bear",
    name: "Polar Bear",
    emoji: "🐻‍❄️",
    funFacts: [
      "Polar bear fur is not white — it is actually transparent and hollow!",
      "Their skin underneath is black to absorb heat from the sun.",
      "They can swim for days at a time without resting.",
    ],
    habitat: "Arctic sea ice",
    diet: "Seals, fish, and berries",
  },
  {
    id: "arctic-fox",
    name: "Arctic Fox",
    emoji: "🦊",
    funFacts: [
      "Arctic foxes change color with the seasons — white in winter, brown in summer.",
      "Their thick tails work like blankets when they curl up to sleep.",
      "They can hear animals moving under the snow!",
    ],
    habitat: "Arctic tundra",
    diet: "Lemmings, birds, and berries",
  },
  {
    id: "snowy-owl",
    name: "Snowy Owl",
    emoji: "🦉",
    funFacts: [
      "Snowy owls can turn their heads almost all the way around — 270 degrees!",
      "Unlike most owls, snowy owls are active during the day.",
      "They can eat up to 5 lemmings per day.",
    ],
    habitat: "Arctic tundra and open fields",
    diet: "Lemmings, rabbits, and birds",
  },
  {
    id: "narwhal",
    name: "Narwhal",
    emoji: "🦄",
    funFacts: [
      "A narwhal's tusk is actually a giant tooth that can grow up to 10 feet long!",
      "They are sometimes called the unicorns of the sea.",
      "Narwhals can dive over 5,000 feet deep.",
    ],
    habitat: "Arctic Ocean",
    diet: "Fish, shrimp, and squid",
  },
  {
    id: "walrus",
    name: "Walrus",
    emoji: "🦭",
    funFacts: [
      "Walruses use their tusks to pull themselves out of the water onto ice.",
      "They can slow their heartbeat to survive in freezing cold water.",
      "A walrus can eat up to 6,000 clams in a single meal!",
    ],
    habitat: "Arctic coastlines",
    diet: "Clams, mussels, and snails",
  },
  {
    id: "harp-seal",
    name: "Harp Seal",
    emoji: "🦭",
    funFacts: [
      "Baby harp seals are born with fluffy white fur to stay warm.",
      "They can hold their breath for up to 20 minutes.",
      "Harp seals can swim at speeds of 15 miles per hour!",
    ],
    habitat: "North Atlantic and Arctic Ocean",
    diet: "Fish and crustaceans",
  },
  {
    id: "beluga-whale",
    name: "Beluga Whale",
    emoji: "🐋",
    funFacts: [
      "Belugas are known as sea canaries because they make all sorts of chirping sounds!",
      "They can move their heads in all directions, unlike most whales.",
      "Baby belugas are born grey and turn white as they grow up.",
    ],
    habitat: "Arctic and sub-Arctic waters",
    diet: "Fish, squid, and crabs",
  },
  {
    id: "reindeer",
    name: "Reindeer",
    emoji: "🦌",
    funFacts: [
      "Reindeer are the only deer where both males and females grow antlers!",
      "Their noses warm up cold air before it reaches their lungs.",
      "Reindeer eyes change color from gold in summer to blue in winter.",
    ],
    habitat: "Arctic tundra and boreal forests",
    diet: "Lichen, grass, and leaves",
  },
  {
    id: "arctic-hare",
    name: "Arctic Hare",
    emoji: "🐇",
    funFacts: [
      "Arctic hares can run up to 40 miles per hour!",
      "They dig shelters in the snow to stay warm.",
      "In winter, they are almost entirely white to blend in with the snow.",
    ],
    habitat: "Arctic tundra",
    diet: "Mosses, lichens, and woody plants",
  },
];

export const ARCTIC_FACTS: ArcticFact[] = [
  {
    id: "northern-lights",
    title: "Northern Lights",
    emoji: "🌌",
    description:
      "The Northern Lights (Aurora Borealis) are colorful lights that dance across the sky near the North Pole. They happen when tiny particles from the sun hit gases in our atmosphere!",
    category: "Sky",
  },
  {
    id: "midnight-sun",
    title: "Midnight Sun",
    emoji: "☀️",
    description:
      "In summer, the sun never sets in the Arctic! This means some places have 24 hours of daylight for weeks. In winter, it is the opposite — the sun does not rise for weeks.",
    category: "Sky",
  },
  {
    id: "ice-formations",
    title: "Ice Formations",
    emoji: "🧊",
    description:
      "Sea ice in the Arctic can be over 10 feet thick! It grows during winter and shrinks in summer. Animals like polar bears depend on sea ice to hunt.",
    category: "Ice",
  },
  {
    id: "arctic-temperatures",
    title: "Arctic Temperatures",
    emoji: "🌡️",
    description:
      "Winter temperatures in the Arctic can drop below minus 40 degrees! That is so cold that boiling water thrown into the air turns instantly into snow.",
    category: "Weather",
  },
  {
    id: "icebergs",
    title: "Icebergs",
    emoji: "🏔️",
    description:
      "Only about 10% of an iceberg is visible above water — the rest is hidden below! Some icebergs are as big as small countries.",
    category: "Ice",
  },
  {
    id: "arctic-vs-antarctic",
    title: "Arctic vs Antarctic",
    emoji: "🌍",
    description:
      "The Arctic is an ocean surrounded by land, while Antarctica is land surrounded by ocean. Penguins live in the south and polar bears live in the north — they never meet in the wild!",
    category: "Geography",
  },
  {
    id: "polar-ice-caps",
    title: "Polar Ice Caps",
    emoji: "❄️",
    description:
      "The polar ice caps hold about 70% of the world's fresh water! If all the ice melted, sea levels would rise dramatically.",
    category: "Ice",
  },
];
