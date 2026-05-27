import type { MenuItem } from "@/lib/menu-types";

export type DishTag = "spicy" | "vegetarian";

const SPICY_KEYWORDS = [
  "aštr", "astr", "spicy", "diavola", "diabola", "pikant", "chili", "čili", "cili",
  "jalapeñ", "jalapen", "halapen", "peperonc", "pepperonc", "habaner", "острый",
  "scharf", "picant", "scoville", "carolina", "sriracha", "tabasco",
];

// Meat / fish keywords — if any present, the dish is NOT vegetarian.
const MEAT_KEYWORDS = [
  "kumpis", "kumpio", "salam", "pepperon", "peperon", "vištien", "vistien", "vištą", "vista",
  "jautien", "kiaulien", "kiauliena", "šonin", "sonin", "bacon", "lašiš", "lasis", "lašišos",
  "tunas", "tuno", "krevet", "kreveč", "krev", "shrimp", "prawn", "kalmar", "salmon",
  "ančiuv", "anchov", "anciuv", "anchov", "prosciutt", "prosciuto", "salami", "chorizo",
  "kebab", "mėsos", "mesos", "mėsa", "mesa", "ham", "meat", "chicken", "beef", "pork",
  "fish", "žuvis", "zuvis", "tuncas", "lazania", "lasagna", "lazanja",
  "куриц", "говядин", "свинин", "ветчин", "колбас", "рыб", "тунец", "креветк",
];

const VEG_KEYWORDS = [
  "vegetar", "vege", "veggie", "veg.", "margarit", "marghr", "marghe", "funghi",
  "4 sūri", "4 suri", "quattro formag", "capres", "вегетар", "грибн", "сырн",
];

function fullText(item: MenuItem): string {
  const parts: string[] = [item.name, item.description];
  if (item.nameTranslations) parts.push(...Object.values(item.nameTranslations));
  if (item.descriptionTranslations) parts.push(...Object.values(item.descriptionTranslations));
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function getDishTags(item: MenuItem): DishTag[] {
  const text = fullText(item);
  const tags: DishTag[] = [];

  if (SPICY_KEYWORDS.some((k) => text.includes(k))) {
    tags.push("spicy");
  }

  const hasMeat = MEAT_KEYWORDS.some((k) => text.includes(k));
  const hasVegHint = VEG_KEYWORDS.some((k) => text.includes(k));
  if (!hasMeat && hasVegHint) {
    tags.push("vegetarian");
  }

  return tags;
}

export const DISH_TAG_LABELS: Record<DishTag, { lt: string; en: string; ru: string; de: string; emoji: string }> = {
  spicy: { lt: "Aštru", en: "Spicy", ru: "Острое", de: "Scharf", emoji: "🌶️" },
  vegetarian: { lt: "Vegetariška", en: "Vegetarian", ru: "Вегетар.", de: "Vegetarisch", emoji: "🌱" },
};

