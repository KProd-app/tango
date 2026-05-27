import type { Language } from "@/lib/i18n/types";

export type MenuItemSize = {
  size: string;
  price: number;
};

export type Translations = Partial<Record<Exclude<Language, "lt">, string>>;

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  sizes: MenuItemSize[] | null;
  nameTranslations: Translations;
  descriptionTranslations: Translations;
  isAiGenerated: boolean;
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  nameTranslations: Translations;
  items: MenuItem[];
};

/**
 * Picks the right translation based on language. Falls back to the Lithuanian
 * (default) value if no translation exists for the requested language.
 */
export function pickTranslation(
  defaultValue: string,
  translations: Translations | null | undefined,
  lang: Language,
): string {
  if (lang === "lt") return defaultValue;
  const value = translations?.[lang];
  return value && value.trim().length > 0 ? value : defaultValue;
}
