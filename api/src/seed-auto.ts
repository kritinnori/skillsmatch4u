import { closeDb, getQuestionsCollection, type QuestionDoc } from "./db";

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

async function seedQuestions() {
  console.log("Starting to seed questions...");

  try {
    const collection = await getQuestionsCollection();

    // Ensure a unique index on the numeric `id` field
    await collection.createIndex({ id: 1 }, { unique: true });

    const existingCount = await collection.countDocuments();

    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing questions. Deleting them...`);
      await collection.deleteMany({});
      console.log("Deleted existing questions.");
    }

    const now = new Date();
    const docs: QuestionDoc[] = questions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      category: q.category,
      created_at: now,
    }));

    const result = await collection.insertMany(docs);

    console.log(`✅ Successfully seeded ${result.insertedCount} questions!`);
    console.log("\nSample questions inserted:");
    docs.slice(0, 3).forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.question}`);
    });
    if (docs.length > 3) {
      console.log(`  ... and ${docs.length - 3} more`);
    }
  } catch (error) {
    console.error("Failed to seed questions:", error);
    await closeDb();
    process.exit(1);
  }

  await closeDb();
}

seedQuestions().then(() => {
  process.exit(0);
});
