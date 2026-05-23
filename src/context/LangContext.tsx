import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translations from "../assets/translation.json";

export type Lang = "de" | "en" | "fr";
export type TranslationKey = keyof typeof translations.en;

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const STORAGE_KEY = "warehouse_lang_v1";
const DEFAULT_LANG: Lang = "en";

const LangContext = createContext<LangContextValue | null>(null);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "de" || saved === "en" || saved === "fr") {
          setLangState(saved);
        }
      } finally {
        setReady(true);
      }
    };

    load();
  }, []);

  const setLang = async (next: Lang) => {
    setLangState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang]?.[key] || translations.en[key] || String(key);
  };

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang]
  );

  if (!ready) {
    return null;
  }

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
};