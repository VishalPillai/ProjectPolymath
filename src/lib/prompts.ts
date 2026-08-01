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
  // History — forgotten corners and slow turning points
  { category: "History", text: "The Taiping Rebellion: how a failed civil exam candidate started a war that killed millions." },
  { category: "History", text: "Why the Ottoman Empire tolerated Jews and Christians while the Inquisition burned them." },
  { category: "History", text: "The Bronze Age Collapse: when every major civilization around the Mediterranean fell at once." },
  { category: "History", text: "How the bicycle helped shape women's clothing and the suffrage movement." },
  { category: "History", text: "The Dutch Tulip Mania: financial bubble, or just a myth historians exaggerated?" },
  { category: "History", text: "Why the Roman Empire never conquered Germania, and what that changed." },

  // Geography — places that explain the world
  { category: "Geography", text: "The Strait of Malacca: why a narrow stretch of water still controls global trade." },
  { category: "Geography", text: "Lake Baikal: the oldest, deepest lake, and what lives nowhere else on Earth." },
  { category: "Geography", text: "How the Himalayas shape weather for two billion people." },
  { category: "Geography", text: "The Empty Quarter: a sand sea the size of France that almost no one lives in." },
  { category: "Geography", text: "Why every Australian city hugs the coast while the interior stays almost empty." },
  { category: "Geography", text: "The Donbas, the Crimea, and the Black Sea: why this region keeps redrawing maps." },

  // Science — ideas that rewire your view of reality
  { category: "Science", text: "Neutrinos: particles that pass through planets like sunlight through glass." },
  { category: "Science", text: "CRISPR: where gene editing came from, and what we are choosing to edit first." },
  { category: "Science", text: "The Fermi paradox: if the universe is so large, where is everyone?" },
  { category: "Science", text: "How mitochondria were once free-living bacteria and still carry their own DNA." },
  { category: "Science", text: "The placebo effect: why believing you are receiving medicine can make you better." },
  { category: "Science", text: "Quantum entanglement: two particles that stay correlated across any distance." },

  // Technology — systems we built, now building us back
  { category: "Technology", text: "How undersea cables carry 99% of international internet traffic." },
  { category: "Technology", text: "The history of GPS: from nuclear-war targeting to food delivery." },
  { category: "Technology", text: "Why AI image generators learned to draw hands wrong, and how they fixed it." },
  { category: "Technology", text: "The TOR network: privacy tool, dark-web highway, or both?" },
  { category: "Technology", text: "How refrigeration reshaped cities, diets, and global migration." },
  { category: "Technology", text: "Starship and the economics of making spaceflight reusable." },

  // Current Affairs — live questions with no final answer yet
  { category: "Current Affairs", text: "India's rise: demographic dividend, manufacturing bet, and the China comparison." },
  { category: "Current Affairs", text: "The global energy transition: why batteries, grids, and permitting matter more than solar panels." },
  { category: "Current Affairs", text: "Artificial intelligence regulation: what the EU, US, and China each think safety means." },
  { category: "Current Affairs", text: "Sahel coups and the reshaping of French influence in West Africa." },
  { category: "Current Affairs", text: "The Arctic: melting ice, shipping lanes, and a new race for territory." },
  { category: "Current Affairs", text: "Demographic decline: how shrinking populations will rewrite economics and politics." },

  // Art & Literature — works that outlast their moment
  { category: "Art & Literature", text: "The Tale of Genji: the world's first novel, written by a Japanese noblewoman." },
  { category: "Art & Literature", text: "How Renaissance patrons used art as soft power before the term existed." },
  { category: "Art & Literature", text: "Why Kafka's unfinished novels still feel like modern office life." },
  { category: "Art & Literature", text: "The poetry of Rumi: 13th-century Sufism that became a 21st-century bestseller." },
  { category: "Art & Literature", text: "Soviet constructivism: art that wanted to build a new society." },
  { category: "Art & Literature", text: "What makes a film canon: awards, critics, or audiences decades later?" },

  // Philosophy — tools for thinking clearly
  { category: "Philosophy", text: "The trolley problem: why a simple ethics thought experiment keeps multiplying." },
  { category: "Philosophy", text: "Epistemic humility: how to hold strong beliefs while knowing you might be wrong." },
  { category: "Philosophy", text: "Determinism vs. free will: does physics leave room for choice?" },
  { category: "Philosophy", text: "The Ship of Theseus: if you replace every part of something, is it still the same thing?" },
  { category: "Philosophy", text: "Moral luck: why we blame people for outcomes they did not fully control." },
  { category: "Philosophy", text: "Stoicism: ancient philosophy or modern productivity cult?" },

  // Economics — incentives that shape behavior
  { category: "Economics", text: "The tragedy of the commons: why shared resources get overused." },
  { category: "Economics", text: "How central banks create and destroy money, and why inflation follows." },
  { category: "Economics", text: "The resource curse: why some oil-rich nations stay poor." },
  { category: "Economics", text: "Behavioral economics: the predictable ways humans are not rational." },
  { category: "Economics", text: "Why housing is expensive in rich cities and what that does to inequality." },
  { category: "Economics", text: "The economics of attention: how scarcity shifted from goods to focus." },

  // Culture — customs, rituals, and social inventions
  { category: "Culture", text: "The Japanese concept of ikigai: purpose, overlap, and Western simplification." },
  { category: "Culture", text: "How the Mediterranean diet is as much social ritual as ingredients." },
  { category: "Culture", text: "The birth of the weekend: a recent invention shaped by labor and religion." },
  { category: "Culture", text: "Hospitality codes across cultures: why some guests refuse food once, others twice." },
  { category: "Culture", text: "How memes function as folklore in the internet age." },
  { category: "Culture", text: "The history of spices: flavor, status, empire, and preservation." },

  // Nature — organisms and ecosystems that do not need us
  { category: "Nature", text: "Mycelial networks: how trees communicate and share nutrients underground." },
  { category: "Nature", text: "The Great Pacific Garbage Patch: what it is, and why it is hard to clean." },
  { category: "Nature", text: "Tardigrades: tiny animals that survive radiation, vacuum, and dehydration." },
  { category: "Nature", text: "Why fire is essential to some forests, even as it destroys others." },
  { category: "Nature", text: "Coral bleaching: what warmer oceans mean for a quarter of marine life." },
  { category: "Nature", text: "The migration of monarch butterflies: three generations to complete one journey." },
];

export function pickTopic(exclude?: string): Topic {
  const pool = TOPICS.filter((t) => t.text !== exclude);
  const list = pool.length > 0 ? pool : TOPICS;
  return list[Math.floor(Math.random() * list.length)]!;
}
