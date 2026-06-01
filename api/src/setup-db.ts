import { closeDb, getDb, getQuestionsCollection } from "./db";

async function setupDatabase() {
  console.log("Setting up MongoDB database...");
  console.log(
    "This will ensure the 'questions' collection exists and create indexes.\n"
  );

  try {
    const db = await getDb();

    // Ensure the collection exists (MongoDB creates collections lazily, but we
    // create it explicitly here so the setup output is clear).
    const existing = await db
      .listCollections({ name: "questions" })
      .toArray();

    if (existing.length === 0) {
      await db.createCollection("questions");
      console.log("✅ Created 'questions' collection.");
    } else {
      console.log("ℹ️  'questions' collection already exists.");
    }

    const collection = await getQuestionsCollection();
    await collection.createIndex({ id: 1 }, { unique: true });
    console.log("✅ Ensured unique index on 'id'.");

    console.log("\n✅ Database setup complete!");
    console.log("You can now run: npm run seed\n");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    console.error(
      "\nMake sure MONGODB_URI (and optionally MONGODB_DB) are set in your .env file.\n"
    );
    await closeDb();
    process.exit(1);
  }

  await closeDb();
  process.exit(0);
}

setupDatabase();
