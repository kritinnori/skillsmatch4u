import "dotenv/config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { QUESTION_TRANSLATIONS } from "./translations";

// --- DynamoDB setup ---

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE_NAME =
  process.env.DYNAMODB_QUESTIONS_TABLE || "skillsmatch4u-questions";

// --- Questions data (same as seed-auto.ts) ---

const questions = [
  // Interests
  { question: "I enjoy figuring out how things work.", category: "Interests" },
  { question: "I like working with numbers, data, or logical problems.", category: "Interests" },
  { question: "I enjoy creative activities like writing, art, music, or design.", category: "Interests" },
  { question: "I like helping people solve personal or emotional problems.", category: "Interests" },
  { question: "I enjoy leading group activities or influencing others.", category: "Interests" },
  { question: "I like organizing information, schedules, or systems.", category: "Interests" },
  { question: "I enjoy building, fixing, or working with physical objects.", category: "Interests" },
  { question: "I like researching topics deeply before forming opinions.", category: "Interests" },
  { question: "I enjoy presenting ideas or speaking in front of others.", category: "Interests" },
  { question: "I prefer structured tasks over open-ended creative ones", category: "Interests" },

  // Strengths
  { question: "I learn new technologies or tools quickly.", category: "Strengths" },
  { question: "I am good at explaining complex ideas in simple ways.", category: "Strengths" },
  { question: "I can stay focused on difficult tasks for long periods of time.", category: "Strengths" },
  { question: "I usually notice patterns or trends that others miss.", category: "Strengths" },

  // Personality
  { question: "I prefer working independently rather than in groups.", category: "Personality" },
  { question: "I feel energized after interacting with many people.", category: "Personality" },
  { question: "I like having clear instructions rather than vague goals.", category: "Personality" },
  { question: "I am comfortable taking risks if the reward is meaningful.", category: "Personality" },
  { question: "I get stressed when things are unorganized.", category: "Personality" },
  { question: "I prefer stability over frequent change.", category: "Personality" },
  { question: "I enjoy competing with others to be the best.", category: "Personality" },
  { question: "I value work that feels meaningful more than high salary alone.", category: "Personality" },
  { question: "I stay calm even when deadlines are tight.", category: "Personality" },
  { question: "I like having freedom to choose how I complete tasks.", category: "Personality" },
  { question: "I am good at planning ahead rather than improvising.", category: "Personality" },
  { question: "I feel confident solving unfamiliar problems.", category: "Personality" },
  { question: "People often rely on me when something needs to be done correctly.", category: "Personality" },
  { question: "I adapt quickly when situations change.", category: "Personality" },
  { question: "I tend to think carefully before making decisions.", category: "Personality" },
  { question: "I often come up with original solutions to problems.", category: "Personality" },
];

// --- Seed logic ---

async function clearTable() {
  console.log("Scanning for existing items to clear...");
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      ProjectionExpression: "id",
    })
  );

  const items = result.Items || [];
  if (items.length === 0) {
    console.log("Table is already empty.");
    return;
  }

  console.log(`Deleting ${items.length} existing item(s)...`);
  for (const item of items) {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: item.id },
      })
    );
  }
  console.log("Cleared.");
}

async function seedQuestions() {
  console.log(`Seeding ${questions.length} questions into ${TABLE_NAME}...\n`);

  await clearTable();

  let seeded = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const id = i + 1;

    // Build translations map for this question
    const translations: Record<string, string> = {};
    for (const [lang, langTranslations] of Object.entries(QUESTION_TRANSLATIONS)) {
      const text = langTranslations[i];
      if (text && text.trim().length > 0) {
        translations[lang] = text;
      }
    }

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id,
          question: q.question,
          category: q.category,
          translations: Object.keys(translations).length > 0 ? translations : undefined,
        },
      })
    );

    seeded++;
  }

  console.log(`✅ Successfully seeded ${seeded} questions with translations!`);
  console.log(`\nLanguages included: en (base), ${Object.keys(QUESTION_TRANSLATIONS).join(", ")}`);
  console.log("\nSample (id=1):");
  console.log(`  EN: ${questions[0].question}`);
  const sampleLangs = Object.keys(QUESTION_TRANSLATIONS).slice(0, 3);
  for (const lang of sampleLangs) {
    console.log(`  ${lang.toUpperCase()}: ${QUESTION_TRANSLATIONS[lang][0]}`);
  }
  console.log("  ...");
}

seedQuestions()
  .then(() => {
    console.log("\nDone.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
