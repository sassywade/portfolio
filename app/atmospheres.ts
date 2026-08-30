export const PORTFOLIO_ATMOSPHERES = [
  { id: "grid", label: "Studio card grid" },
  { id: "day", label: "Clear day" },
  { id: "sunny", label: "Sunny" },
  { id: "foggy", label: "Foggy" },
  { id: "sunrise", label: "Sunrise" },
  { id: "sunset", label: "Sunset" },
  { id: "rainy", label: "Rainy" },
  { id: "night", label: "Night" },
] as const;

export type PortfolioAtmosphere = (typeof PORTFOLIO_ATMOSPHERES)[number]["id"];
