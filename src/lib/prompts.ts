export type Category =
  | "History"
  | "Geography"
  | "Science"
  | "Art & Literature"
  | "Philosophy"
  | "Economics"
  | "Technology"
  | "Everyday Life";

export type Mode = "Off the cuff" | "Deep research";

export type Prompt = {
  category: Category;
  mode: Mode;
  text: string;
};

export const CATEGORIES: Category[] = [
  "History",
  "Geography",
  "Science",
  "Art & Literature",
  "Philosophy",
  "Economics",
  "Technology",
  "Everyday Life",
];

export const PROMPTS: Prompt[] = [
  // History
  { category: "History", mode: "Off the cuff", text: "Describe a historical figure you would invite to dinner, and what you would ask them first." },
  { category: "History", mode: "Deep research", text: "Explain how a single invention reshaped daily life in the century that followed it." },
  { category: "History", mode: "Off the cuff", text: "Tell the story of an event from your country's past as if you were there." },
  { category: "History", mode: "Deep research", text: "Argue whether empires collapse mostly from within or from outside pressure." },

  // Geography
  { category: "Geography", mode: "Off the cuff", text: "Describe the landscape you grew up in to someone who has never seen it." },
  { category: "Geography", mode: "Deep research", text: "Explain why rivers decide where cities are born — and where they die." },
  { category: "Geography", mode: "Off the cuff", text: "Pick a border on the map and explain what makes it interesting." },
  { category: "Geography", mode: "Deep research", text: "Describe how climate shapes the food, housing and rhythm of one region." },

  // Science
  { category: "Science", mode: "Off the cuff", text: "Explain gravity to a curious eight-year-old in one minute." },
  { category: "Science", mode: "Deep research", text: "Walk through how a vaccine teaches the immune system something new." },
  { category: "Science", mode: "Off the cuff", text: "What natural phenomenon still amazes you? Describe it out loud." },
  { category: "Science", mode: "Deep research", text: "Explain entropy using only examples from your kitchen." },

  // Art & Literature
  { category: "Art & Literature", mode: "Off the cuff", text: "Describe a painting or a song that changed how you saw something." },
  { category: "Art & Literature", mode: "Deep research", text: "Explain what makes a story survive for a thousand years." },
  { category: "Art & Literature", mode: "Off the cuff", text: "Summarise the last book you read — then say who should read it and why." },
  { category: "Art & Literature", mode: "Deep research", text: "Compare how two art movements answered the same question differently." },

  // Philosophy
  { category: "Philosophy", mode: "Off the cuff", text: "Is it better to be respected or to be liked? Defend your answer." },
  { category: "Philosophy", mode: "Deep research", text: "Explain the difference between knowing something and believing it." },
  { category: "Philosophy", mode: "Off the cuff", text: "What does a good life look like to you? Be concrete." },
  { category: "Philosophy", mode: "Deep research", text: "Make the strongest case for a view you personally disagree with." },

  // Economics
  { category: "Economics", mode: "Off the cuff", text: "Explain inflation to someone using only the price of bread." },
  { category: "Economics", mode: "Deep research", text: "Describe how a single supply chain connects three continents." },
  { category: "Economics", mode: "Off the cuff", text: "Would you rather own a small business or a small share of a big one? Why?" },
  { category: "Economics", mode: "Deep research", text: "Explain why two countries trade even when one makes everything better." },

  // Technology
  { category: "Technology", mode: "Off the cuff", text: "Describe the piece of technology you would miss most, and why." },
  { category: "Technology", mode: "Deep research", text: "Explain how a message travels from your phone to a friend abroad." },
  { category: "Technology", mode: "Off the cuff", text: "What should a machine never be allowed to decide for us?" },
  { category: "Technology", mode: "Deep research", text: "Explain what a model actually learns when it 'learns' a language." },

  // Everyday Life
  { category: "Everyday Life", mode: "Off the cuff", text: "Walk someone through your ideal ordinary Tuesday, hour by hour." },
  { category: "Everyday Life", mode: "Off the cuff", text: "Give directions from your home to your favourite place, out loud." },
  { category: "Everyday Life", mode: "Deep research", text: "Explain a dish from your culture: its origin, its method, its meaning." },
  { category: "Everyday Life", mode: "Off the cuff", text: "Describe a small habit that quietly improved your life." },
];

export const COMFORT_ZONES = [
  { label: "Gentle", description: "Familiar ground, easy vocabulary" },
  { label: "Balanced", description: "A little stretch, still comfortable" },
  { label: "Stretch", description: "Abstract ideas, harder register" },
] as const;

export type ComfortZone = (typeof COMFORT_ZONES)[number]["label"];

const ZONE_CATEGORIES: Record<ComfortZone, Category[]> = {
  Gentle: ["Everyday Life", "Geography", "History"],
  Balanced: ["History", "Geography", "Science", "Art & Literature", "Technology"],
  Stretch: ["Philosophy", "Economics", "Science", "Art & Literature", "History"],
};

export function pickPrompt(zone: ComfortZone, exclude?: string): Prompt {
  const allowed = ZONE_CATEGORIES[zone];
  const pool = PROMPTS.filter(
    (p) =>
      allowed.includes(p.category) &&
      (zone === "Gentle" ? p.mode === "Off the cuff" : true) &&
      p.text !== exclude,
  );
  const list = pool.length > 0 ? pool : PROMPTS;
  return list[Math.floor(Math.random() * list.length)]!;
}
