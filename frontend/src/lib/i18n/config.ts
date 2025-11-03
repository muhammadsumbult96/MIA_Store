export type Locale = "vi" | "en";

export const defaultLocale: Locale = "vi";
export const locales: Locale[] = ["vi", "en"];

export function getLocaleFromStorage(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem("locale");
  return stored && locales.includes(stored as Locale) ? (stored as Locale) : defaultLocale;
}

export function setLocaleToStorage(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("locale", locale);
}

