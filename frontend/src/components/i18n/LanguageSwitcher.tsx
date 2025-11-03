"use client";

import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/components/ui/Button";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === "vi" ? "primary" : "outline"}
        size="sm"
        onClick={() => setLocale("vi")}
      >
        VI
      </Button>
      <Button
        variant={locale === "en" ? "primary" : "outline"}
        size="sm"
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
    </div>
  );
}

