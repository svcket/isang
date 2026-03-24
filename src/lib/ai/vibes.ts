export type Vibe = {
  tone: string;
  adjectives: string[];
  style: "luxury" | "budget" | "adventure" | "culture" | "balanced";
  accent_color: string;
};

export const vibeMap: Record<string, Vibe> = {
  barcelona: {
    tone: "Artistic & Architectural",
    adjectives: ["Gothic", "Vibrant", "Creative", "Sun-soaked", "Gaudí-inspired"],
    style: "culture",
    accent_color: "#E63946",
  },
  paris: {
    tone: "Dreamy & Sophisticated",
    adjectives: ["Chic", "Romance", "Culinary", "Iconic", "Historic"],
    style: "luxury",
    accent_color: "#1D3557",
  },
  tokyo: {
    tone: "Hyper-Modern & Pulse-Driven",
    adjectives: ["Neon", "Futuristic", "Electric", "Orderly", "Endless"],
    style: "adventure",
    accent_color: "#A8DADC",
  },
  london: {
    tone: "Polished & Historic",
    adjectives: ["Global", "Pomp", "Eclectic", "Royal", "Bustling"],
    style: "balanced",
    accent_color: "#457B9D",
  },
  vienna: {
    tone: "Imperial & Orchestral",
    adjectives: ["Classic", "Musical", "Grand", "Elegant", "Symphonic"],
    style: "culture",
    accent_color: "#C08552",
  },
  default: {
    tone: "Exploratory & Insightful",
    adjectives: ["Curated", "Authentic", "Memorable", "Unique", "Seamless"],
    style: "balanced",
    accent_color: "#1d1d1f",
  },
};

export const getVibe = (destination: string): Vibe => {
  const lower = destination.toLowerCase();
  const entries = Object.entries(vibeMap);
  for (const [key, vibe] of entries) {
    if (lower.includes(key)) return vibe;
  }
  return vibeMap["default"]!;
};
