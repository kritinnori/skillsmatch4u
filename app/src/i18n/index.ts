import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import hi from "./locales/hi";
import bn from "./locales/bn";
import te from "./locales/te";
import mr from "./locales/mr";
import ta from "./locales/ta";
import ur from "./locales/ur";
import gu from "./locales/gu";
import kn from "./locales/kn";
import or from "./locales/or";
import ml from "./locales/ml";
import pa from "./locales/pa";
import as from "./locales/as";

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGE_CODES,
  getLanguageDef,
} from "./languages";

const LANGUAGE_STORAGE_KEY = "quizapp.lang";

function detectInitialLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGE_CODES.includes(stored)) {
    return stored;
  }

  const browserLang = window.navigator.language?.split("-")[0];
  if (browserLang && SUPPORTED_LANGUAGE_CODES.includes(browserLang)) {
    return browserLang;
  }

  return DEFAULT_LANGUAGE;
}

const initialLanguage = detectInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn },
    te: { translation: te },
    mr: { translation: mr },
    ta: { translation: ta },
    ur: { translation: ur },
    gu: { translation: gu },
    kn: { translation: kn },
    or: { translation: or },
    ml: { translation: ml },
    pa: { translation: pa },
    as: { translation: as },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGE_CODES,
  interpolation: {
    escapeValue: false,
  },
});

function applyLanguageAttributes(lang: string) {
  if (typeof document === "undefined") return;
  const def = getLanguageDef(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = def.rtl ? "rtl" : "ltr";
}

applyLanguageAttributes(initialLanguage);

i18n.on("languageChanged", (lng) => {
  applyLanguageAttributes(lng);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  }
});

export default i18n;
