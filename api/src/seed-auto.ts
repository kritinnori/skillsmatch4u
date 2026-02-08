import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
    // Check if questions already exist
    const { data: existingQuestions, error: fetchError } = await supabase
      .from("questions")
      .select("id");

    if (fetchError) {
      // If table doesn't exist, provide helpful error message
      if (fetchError.code === "PGRST205" || fetchError.message?.includes("Could not find the table")) {
        console.error("\n❌ Error: The 'questions' table does not exist in your Supabase database.");
        console.error("\nPlease set up the database first by running:\n");
        console.error("  bun run setup-db\n");
        console.error("Or manually run the SQL from 'api/supabase-schema.sql' in your Supabase SQL Editor.\n");
        process.exit(1);
      }
      console.error("Error fetching existing questions:", fetchError);
      throw fetchError;
    }

    if (existingQuestions && existingQuestions.length > 0) {
      console.log(`Found ${existingQuestions.length} existing questions. Deleting them...`);
      const { error: deleteError } = await supabase
        .from("questions")
        .delete()
        .neq("id", 0); // Delete all rows

      if (deleteError) {
        console.error("Error deleting existing questions:", deleteError);
        throw deleteError;
      }
      console.log("Deleted existing questions.");
    }

    // Insert questions
    const { data, error } = await supabase
      .from("questions")
      .insert(questions.map((q) => ({ question: q.question, category: q.category })))
      .select();

    if (error) {
      console.error("Error inserting questions:", error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} questions!`);
    console.log("\nSample questions inserted:");
    data?.slice(0, 3).forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.question}`);
    });
    if (data && data.length > 3) {
      console.log(`  ... and ${data.length - 3} more`);
    }
  } catch (error) {
    console.error("Failed to seed questions:", error);
    process.exit(1);
  }
}

// Run the seed function
seedQuestions().then(() => {
  process.exit(0);
});
