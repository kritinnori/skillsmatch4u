import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const PORT = process.env.PORT || 3000;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const app = new Elysia()
  .use(cors())
  .get("/", () => {
    return { message: "Quiz API is running" };
  })
  .get("/questions", async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        return { error: "Failed to fetch questions", details: error.message };
      }

      return { questions: data || [] };
    } catch (error) {
      console.error("Error fetching questions:", error);
      return { error: "Internal server error" };
    }
  })
  .post("/analyze", async ({ body }) => {
    try {
      const { answers, questions, additionalInfo } = body as {
        answers: number[];
        questions: Array<{ id: number; question: string }>;
        additionalInfo?: string;
      };

      if (!answers || !questions || answers.length !== questions.length) {
        return { error: "Invalid request: answers and questions must match" };
      }

      // Build the prompt for OpenAI
      let prompt = `You are a career counselor analyzing a personality and career assessment quiz. Based on the user's responses, recommend the most suitable job profile.

The user answered questions on a scale of 1-5 where:
- 1 = Strongly Disagree
- 2 = Disagree
- 3 = Neutral
- 4 = Agree
- 5 = Strongly Agree

Here are the questions and answers:\n\n`;

      questions.forEach((q, index) => {
        const answer = answers[index];
        let answerText = "";
        if (answer === 1) answerText = "Strongly Disagree";
        else if (answer === 2) answerText = "Disagree";
        else if (answer === 3) answerText = "Neutral";
        else if (answer === 4) answerText = "Agree";
        else if (answer === 5) answerText = "Strongly Agree";

        prompt += `Q${index + 1}: ${q.question}\nAnswer: ${answerText} (${answer}/5)\n\n`;
      });

      if (additionalInfo && additionalInfo.trim()) {
        prompt += `\nAdditional Information provided by the user:\n${additionalInfo}\n\n`;
      }

      prompt += `\nBased on these responses, provide a detailed career recommendation in JSON format with the following structure:
{
  "title": "Job Title",
  "description": "Detailed description explaining why this career matches the user's personality and preferences (2-3 sentences)",
  "matchScore": 85,
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "salary": "Salary range (e.g., '$80,000 - $120,000')",
  "growth": "Job growth projection (e.g., '15% growth expected')"
}

Make the recommendation thoughtful and based on the patterns in their answers. The matchScore should be between 75-98.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert career counselor who analyzes personality assessments and provides thoughtful, personalized career recommendations. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        return { error: "Failed to generate recommendation" };
      }

      try {
        const recommendation = JSON.parse(responseContent);
        return { recommendation };
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        return { error: "Failed to parse recommendation" };
      }
    } catch (error) {
      console.error("Error analyzing answers:", error);
      return {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })
  .listen(PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
