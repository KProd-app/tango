import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Language, TranslationKeys } from "./types";
import { translations } from "./translations";

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "tango-lang";

function detectInitialLang(): Language {
  if (typeof window === "undefined") return "lt";
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && stored in translations) return stored;
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (browser in translations) return browser as Language;
  return "lt";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("lt");

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
