export const TOP_PET_MODES = ["off", "quiet", "reactive"] as const;

export type TopPetMode = (typeof TOP_PET_MODES)[number];

export const DEFAULT_TOP_PET_MODE: TopPetMode = "off";
