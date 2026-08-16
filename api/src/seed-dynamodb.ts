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

// --- IT Domain Assessment Questions (12 questions) ---
// Professional SaaS-style interest inventory format
// Based on Holland RIASEC methodology with Likert scale
// Covers 10 IT domains: AI, Data Analytics, Software Dev, Mobile, Testing, 
// Cybersecurity, Cloud/DevOps, Management, UI/UX Design, IT Support

const questions = [
  // Q1: AI & Data Science
  {
    question: "How interested are you in building intelligent systems that can learn and make predictions?",
    category: "AI & Data Science",
  },
  // Q2: Data & Analytics
  {
    question: "How interested are you in analyzing data to discover trends and business insights?",
    category: "Data Analytics",
  },
  // Q3: Software Development
  {
    question: "How interested are you in writing code to build applications and solve problems?",
    category: "Software Development",
  },
  // Q4: Mobile Development
  {
    question: "How interested are you in creating mobile apps that people use daily?",
    category: "Mobile Development",
  },
  // Q5: Testing & QA
  {
    question: "How interested are you in finding bugs and ensuring software quality?",
    category: "Testing & QA",
  },
  // Q6: Cybersecurity
  {
    question: "How interested are you in protecting systems from hackers and security threats?",
    category: "Cybersecurity",
  },
  // Q7: Cloud & DevOps
  {
    question: "How interested are you in managing servers and deploying applications to the cloud?",
    category: "Cloud & DevOps",
  },
  // Q8: IT Management
  {
    question: "How interested are you in leading teams and coordinating technology projects?",
    category: "IT Management",
  },
  // Q9: UI/UX Design
  {
    question: "How interested are you in designing beautiful and easy-to-use interfaces?",
    category: "UI/UX Design",
  },
  // Q10: IT Support & Systems
  {
    question: "How interested are you in troubleshooting issues and helping users solve problems?",
    category: "IT Support",
  },
  // Q11: Problem-Solving Style (Tiebreaker)
  {
    question: "How interested are you in breaking down complex problems into smaller parts?",
    category: "Problem Solving",
  },
  // Q12: Work Preference (Tiebreaker)
  {
    question: "How interested are you in creating new solutions rather than maintaining existing ones?",
    category: "Work Style",
  },
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
