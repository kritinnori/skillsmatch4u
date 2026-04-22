import { closeDb, getQuestionsCollection, type QuestionDoc } from "./db";

const questions = [
  // Interests
  "I enjoy figuring out how things work.",
  "I like working with numbers, data, or logical problems.",
  "I enjoy creative activities like writing, art, music, or design.",
  "I like helping people solve personal or emotional problems.",
  "I enjoy leading group activities or influencing others.",
  "I like organizing information, schedules, or systems.",
  "I enjoy building, fixing, or working with physical objects.",
  "I like researching topics deeply before forming opinions.",
  "I enjoy presenting ideas or speaking in front of others.",
  "I prefer structured tasks over open-ended creative ones",

  // Strengths
  "I learn new technologies or tools quickly.",
  "I am good at explaining complex ideas in simple ways.",
  "I can stay focused on difficult tasks for long periods of time.",
  "I usually notice patterns or trends that others miss.",

  // Personality
  "I prefer working independently rather than in groups.",
  "I feel energized after interacting with many people.",
  "I like having clear instructions rather than vague goals.",
  "I am comfortable taking risks if the reward is meaningful.",
  "I get stressed when things are unorganized.",
  "I prefer stability over frequent change.",
  "I enjoy competing with others to be the best.",
  "I value work that feels meaningful more than high salary alone.",
  "I stay calm even when deadlines are tight.",
  "I like having freedom to choose how I complete tasks.",
  "I am good at planning ahead rather than improvising.",
  "I feel confident solving unfamiliar problems.",
  "People often rely on me when something needs to be done correctly.",
  "I adapt quickly when situations change.",
  "I tend to think carefully before making decisions.",
  "I often come up with original solutions to problems.",
];

async function seedQuestions() {
  console.log("Starting to seed questions...");

  try {
    const collection = await getQuestionsCollection();

    await collection.createIndex({ id: 1 }, { unique: true });

    const existingCount = await collection.countDocuments();

    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing questions.`);
      const response = await new Promise<string>((resolve) => {
        process.stdin.setEncoding("utf8");
        console.log("Do you want to delete existing questions and reseed? (yes/no): ");
        process.stdin.once("data", (data) => {
          resolve(data.toString().trim().toLowerCase());
        });
      });

      if (response === "yes" || response === "y") {
        await collection.deleteMany({});
        console.log("Deleted existing questions.");
      } else {
        console.log("Skipping seed. Existing questions remain.");
        await closeDb();
        process.exit(0);
      }
    }

    const now = new Date();
    const docs: QuestionDoc[] = questions.map((question, index) => ({
      id: index + 1,
      question,
      category: "General",
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
