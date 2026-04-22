export interface LanguageDef {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageDef[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
];

export const DEFAULT_LANGUAGE = "en";

const byCode = new Map(LANGUAGES.map((l) => [l.code, l]));

export function normalizeLanguage(code: string | undefined | null): string {
  if (!code) return DEFAULT_LANGUAGE;
  const normalized = code.toLowerCase().split("-")[0];
  return byCode.has(normalized) ? normalized : DEFAULT_LANGUAGE;
}

export function getLanguageName(code: string): string {
  return byCode.get(code)?.name ?? "English";
}
