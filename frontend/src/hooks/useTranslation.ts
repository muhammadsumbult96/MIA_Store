"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { getLocaleFromStorage, setLocaleToStorage, type Locale } from "@/lib/i18n/config";
import viTranslations from "@/locales/vi.json";
import enTranslations from "@/locales/en.json";

type TranslationKey = keyof typeof viTranslations | `${keyof typeof viTranslations}.${string}`;

const translations = {
  vi: viTranslations,
  en: enTranslations,
};

interface TranslationContextType {
  t: (key: TranslationKey) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocaleState(getLocaleFromStorage());
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleToStorage(newLocale);
  };

  const t = (key: TranslationKey): string => {
    const keys = key.split(".");
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}

function getDefaultLocale(): Locale {
  if (typeof window !== "undefined") {
    return getLocaleFromStorage();
  }
  return "vi";
}

const defaultLocale = getDefaultLocale();

