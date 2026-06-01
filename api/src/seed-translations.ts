import { closeDb, getQuestionsCollection } from "./db";
import {
  QUESTION_TRANSLATIONS,
  TRANSLATION_LANGUAGE_CODES,
} from "./translations";

/**
 * Writes per-language translations onto the existing English question
 * documents in the `questions` collection.
 *
 * - English documents must already be seeded via `npm run seed`. This script
 *   does NOT touch the English `question` text — it only adds a `translations`
 *   sub-document of the form:
 *     translations: { hi: "...", bn: "...", ... }
 *
 * - Matching is done by numeric `id`. Each translation array is indexed by
 *   position: translation[i] is attached to the document with id === i + 1.
 *
 * - Safe to re-run. Existing translations for a language get overwritten
 *   with the latest values in code.
 */
async function seedTranslations() {
  console.log("Seeding question translations...\n");

  try {
    const collection = await getQuestionsCollection();

    const english = await collection
      .find({}, { projection: { _id: 0, id: 1, question: 1 } })
      .sort({ id: 1 })
      .toArray();

    if (english.length === 0) {
      console.error(
        "❌ No English questions found in the database. Run `npm run seed` first."
      );
      await closeDb();
      process.exit(1);
    }

    console.log(`Found ${english.length} English question(s).`);
    console.log(
      `Seeding translations for ${TRANSLATION_LANGUAGE_CODES.length} language(s): ${TRANSLATION_LANGUAGE_CODES.join(", ")}\n`
    );

    // Validate translation array lengths up front so we fail fast.
    for (const [lang, translations] of Object.entries(QUESTION_TRANSLATIONS)) {
      if (translations.length !== english.length) {
        console.error(
          `❌ Translation length mismatch for '${lang}': expected ${english.length} entries, got ${translations.length}.`
        );
        console.error(
          "   Make sure each language array in api/src/translations/<lang>.ts matches the seeded question count."
        );
        await closeDb();
        process.exit(1);
      }
    }

    let totalUpdated = 0;

    for (let i = 0; i < english.length; i++) {
      const row = english[i];
      if (!row || typeof row.id !== "number") continue;

      const setFields: Record<string, string> = {};
      for (const [lang, translations] of Object.entries(QUESTION_TRANSLATIONS)) {
        const value = translations[i];
        if (typeof value === "string" && value.trim().length > 0) {
          setFields[`translations.${lang}`] = value;
        }
      }

      if (Object.keys(setFields).length === 0) continue;

      const result = await collection.updateOne(
        { id: row.id },
        { $set: setFields }
      );
      if (result.matchedCount > 0) totalUpdated++;
    }

    console.log(
      `✅ Wrote translations onto ${totalUpdated} / ${english.length} question document(s).`
    );
    console.log("\nSample (question id=1):");
    const sample = await collection.findOne(
      { id: 1 },
      { projection: { _id: 0 } }
    );
    if (sample) {
      console.log(`  EN: ${sample.question}`);
      const sampleTranslations =
        (sample as unknown as { translations?: Record<string, string> })
          .translations ?? {};
      for (const lang of TRANSLATION_LANGUAGE_CODES.slice(0, 3)) {
        console.log(`  ${lang.toUpperCase()}: ${sampleTranslations[lang] ?? "(missing)"}`);
      }
      console.log("  ...");
    }
  } catch (error) {
    console.error("Failed to seed translations:", error);
    await closeDb();
    process.exit(1);
  }

  await closeDb();
}

seedTranslations().then(() => {
  process.exit(0);
});
