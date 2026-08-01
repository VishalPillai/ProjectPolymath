export type Category =
  | "History"
  | "Geography"
  | "Science"
  | "Technology"
  | "Current Affairs"
  | "Art & Literature"
  | "Philosophy"
  | "Economics"
  | "Culture"
  | "Nature";

export type Topic = {
  category: Category;
  text: string;
};

export const CATEGORIES: Category[] = [
  "History",
  "Geography",
  "Science",
  "Technology",
  "Current Affairs",
  "Art & Literature",
  "Philosophy",
  "Economics",
  "Culture",
  "Nature",
];

export const TOPICS: Topic[] = [
  // History
  { category: "History", text: "The Taiping Rebellion" },
  { category: "History", text: "The Bronze Age Collapse" },
  { category: "History", text: "Ottoman millet system" },
  { category: "History", text: "Dutch Tulip Mania" },
  { category: "History", text: "The Silk Road" },
  { category: "History", text: "The Fall of Constantinople" },
  { category: "History", text: "The Meiji Restoration" },
  { category: "History", text: "The Haitian Revolution" },
  { category: "History", text: "The Congress of Vienna" },
  { category: "History", text: "The Cathar Crusade" },

  // Geography
  { category: "Geography", text: "The Strait of Malacca" },
  { category: "Geography", text: "Lake Baikal" },
  { category: "Geography", text: "The Himalayas" },
  { category: "Geography", text: "The Empty Quarter" },
  { category: "Geography", text: "The Mariana Trench" },
  { category: "Geography", text: "The Demilitarized Zone" },
  { category: "Geography", text: "The Atacama Desert" },
  { category: "Geography", text: "The Khyber Pass" },
  { category: "Geography", text: "The Suez Canal" },
  { category: "Geography", text: "The Greenland Ice Sheet" },

  // Science
  { category: "Science", text: "Neutrinos" },
  { category: "Science", text: "CRISPR" },
  { category: "Science", text: "Quantum entanglement" },
  { category: "Science", text: "Mitochondrial DNA" },
  { category: "Science", text: "The Fermi paradox" },
  { category: "Science", text: "Tardigrades" },
  { category: "Science", text: "Mycelial networks" },
  { category: "Science", text: "Dark matter" },
  { category: "Science", text: "Epigenetics" },
  { category: "Science", text: "The Placebo effect" },

  // Technology
  { category: "Technology", text: "Undersea internet cables" },
  { category: "Technology", text: "GPS history" },
  { category: "Technology", text: "Reusable rockets" },
  { category: "Technology", text: "The TOR network" },
  { category: "Technology", text: "Refrigeration technology" },
  { category: "Technology", text: "Semiconductor lithography" },
  { category: "Technology", text: "Blockchain consensus" },
  { category: "Technology", text: "Brain-computer interfaces" },
  { category: "Technology", text: "Quantum computing" },
  { category: "Technology", text: "Autonomous navigation" },

  // Current Affairs
  { category: "Current Affairs", text: "India's manufacturing rise" },
  { category: "Current Affairs", text: "Global energy transition" },
  { category: "Current Affairs", text: "AI regulation" },
  { category: "Current Affairs", text: "Sahel geopolitics" },
  { category: "Current Affairs", text: "Arctic territorial claims" },
  { category: "Current Affairs", text: "Demographic decline" },
  { category: "Current Affairs", text: "Space resource mining" },
  { category: "Current Affairs", text: "De-dollarization" },
  { category: "Current Affairs", text: "Climate migration" },
  { category: "Current Affairs", text: "Gene-editing ethics" },

  // Art & Literature
  { category: "Art & Literature", text: "The Tale of Genji" },
  { category: "Art & Literature", text: "Soviet constructivism" },
  { category: "Art & Literature", text: "Renaissance patronage" },
  { category: "Art & Literature", text: "Kafka's bureaucracy" },
  { category: "Art & Literature", text: "Rumi and Sufi poetry" },
  { category: "Art & Literature", text: "Japanese wabi-sabi" },
  { category: "Art & Literature", text: "Bauhaus design" },
  { category: "Art & Literature", text: "Magical realism" },
  { category: "Art & Literature", text: "Film noir" },
  { category: "Art & Literature", text: "Dada and surrealism" },

  // Philosophy
  { category: "Philosophy", text: "The trolley problem" },
  { category: "Philosophy", text: "Epistemic humility" },
  { category: "Philosophy", text: "Determinism vs free will" },
  { category: "Philosophy", text: "The Ship of Theseus" },
  { category: "Philosophy", text: "Moral luck" },
  { category: "Philosophy", text: "Stoicism" },
  { category: "Philosophy", text: "Phenomenology" },
  { category: "Philosophy", text: "Existentialism" },
  { category: "Philosophy", text: "Chinese legalism" },
  { category: "Philosophy", text: "Effective altruism" },

  // Economics
  { category: "Economics", text: "Tragedy of the commons" },
  { category: "Economics", text: "Central banking" },
  { category: "Economics", text: "Resource curse" },
  { category: "Economics", text: "Behavioral economics" },
  { category: "Economics", text: "Housing affordability" },
  { category: "Economics", text: "Attention economy" },
  { category: "Economics", text: "Cryptocurrency stablecoins" },
  { category: "Economics", text: "Universal basic income" },
  { category: "Economics", text: "Carbon markets" },
  { category: "Economics", text: "Sovereign debt crises" },

  // Culture
  { category: "Culture", text: "Japanese ikigai" },
  { category: "Culture", text: "Mediterranean diet rituals" },
  { category: "Culture", text: "The invention of the weekend" },
  { category: "Culture", text: "Hospitality codes" },
  { category: "Culture", text: "Internet memes as folklore" },
  { category: "Culture", text: "Spice trade history" },
  { category: "Culture", text: "Taboos around food" },
  { category: "Culture", text: "Coming-of-age rituals" },
  { category: "Culture", text: "Nomadic pastoralism" },
  { category: "Culture", text: "Sign language evolution" },

  // Nature
  { category: "Nature", text: "Mycelial networks" },
  { category: "Nature", text: "The Great Pacific Garbage Patch" },
  { category: "Nature", text: "Tardigrades" },
  { category: "Nature", text: "Crown shyness" },
  { category: "Nature", text: "Coral bleaching" },
  { category: "Nature", text: "Monarch butterfly migration" },
  { category: "Nature", text: "Deep-sea hydrothermal vents" },
  { category: "Nature", text: "Bioluminescence" },
  { category: "Nature", text: "Wolf reintroduction" },
  { category: "Nature", text: "The water cycle" },
];

export function pickTopic(exclude?: string): Topic {
  const pool = TOPICS.filter((t) => t.text !== exclude);
  const list = pool.length > 0 ? pool : TOPICS;
  return list[Math.floor(Math.random() * list.length)]!;
}
