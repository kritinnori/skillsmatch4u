import hi from "./hi";
import bn from "./bn";
import te from "./te";
import mr from "./mr";
import ta from "./ta";
import ur from "./ur";
import gu from "./gu";
import kn from "./kn";
import or from "./or";
import ml from "./ml";
import pa from "./pa";
import as from "./as";

/**
 * Translations for the 30 seeded questions.
 *
 * Each value is an array of 30 strings, in the EXACT same order as the
 * questions list in `seed-auto.ts`. The seed script maps by position
 * (translation[i] corresponds to question with id i+1).
 *
 * English is intentionally NOT included here — the canonical English text
 * already lives in the `question` field of each Mongo document.
 */
export const QUESTION_TRANSLATIONS: Record<string, string[]> = {
  hi,
  bn,
  te,
  mr,
  ta,
  ur,
  gu,
  kn,
  or,
  ml,
  pa,
  as,
};

export const TRANSLATION_LANGUAGE_CODES = Object.keys(QUESTION_TRANSLATIONS);
