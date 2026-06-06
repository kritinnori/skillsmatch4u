import "dotenv/config";
import { MongoClient, type Db, type Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB || "quiz_app";

export interface QuestionDoc {
  id: number;
  question: string;
  category: string;
  created_at: Date;
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Please configure it in your .env file."
    );
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(MONGODB_DB);
  return db;
}

export async function getQuestionsCollection(): Promise<Collection<QuestionDoc>> {
  const database = await getDb();
  return database.collection<QuestionDoc>("questions");
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
