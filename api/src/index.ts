import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import OpenAI from "openai";
import { getQuestionsCollection } from "./db";
import {
  DEFAULT_LANGUAGE,
  getLanguageName,
  normalizeLanguage,
} from "./languages";

const PORT = process.env.PORT || 3000;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

type AnswerQuestion = { id: number; question: string };

interface QuestionRow {
  id: number;
  question: string;
  category: string;
}

function answerLabel(answer: number): string {
  if (answer === 1) return "Strongly Disagree";
  if (answer === 2) return "Disagree";
  if (answer === 3) return "Neutral";
  if (answer === 4) return "Agree";
  if (answer === 5) return "Strongly Agree";
  return "Unknown";
}

function formatQuizResponses(
  answers: number[],
  questions: AnswerQuestion[],
  additionalInfo?: string
): string {
  let section = `The user answered questions on a scale of 1-5 where:
- 1 = Strongly Disagree
- 2 = Disagree
- 3 = Neutral
- 4 = Agree
- 5 = Strongly Agree

Here are the questions and answers:\n\n`;

  questions.forEach((q, index) => {
    const answer = answers[index];
    section += `Q${index + 1}: ${q.question}\nAnswer: ${answerLabel(answer)} (${answer}/5)\n\n`;
  });

  if (additionalInfo && additionalInfo.trim()) {
    section += `\nAdditional Information provided by the user:\n${additionalInfo}\n\n`;
  }

  return section;
}

function languageInstruction(language: string): string {
  if (language === DEFAULT_LANGUAGE) {
    return "Respond in English.";
  }
  const name = getLanguageName(language);
  return `Respond fully in ${name} (language code: ${language}). All human-readable string values in the JSON (titles, descriptions, reasons, skill names, salary, growth, location) must be written naturally in ${name}. URLs must remain in their original form. Do not mix languages.`;
}

async function runJsonCompletion<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T | null> {
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    return JSON.parse(content) as T;
  } catch (parseError) {
    console.error("Error parsing OpenAI response:", parseError);
    return null;
  }
}

/**
 * In-memory cache for translated questions, keyed by language code.
 * The English source is loaded fresh from MongoDB on each cache miss.
 */
const questionCache = new Map<string, QuestionRow[]>();

async function loadEnglishQuestions(): Promise<QuestionRow[]> {
  const collection = await getQuestionsCollection();
  const data = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();
  return (data as unknown as QuestionRow[]) || [];
}

async function translateQuestions(
  questions: QuestionRow[],
  language: string
): Promise<QuestionRow[]> {
  if (questions.length === 0) return questions;

  const languageName = getLanguageName(language);
  const payload = questions.map((q) => ({
    id: q.id,
    category: q.category,
    question: q.question,
  }));

  const prompt = `Translate the "question" field of each item below into ${languageName} (language code: ${language}).
- Keep the original meaning and tone.
- Do NOT translate the "id" or "category" fields — keep them exactly as-is.
- Translate "question" naturally and conversationally in ${languageName}.
- Return valid JSON only, in this exact shape:
{
  "items": [
    { "id": <number>, "category": <original string>, "question": <translated string> }
  ]
}

Items:
${JSON.stringify(payload, null, 2)}`;

  const parsed = await runJsonCompletion<{
    items?: Array<{ id: number; category: string; question: string }>;
  }>(
    `You are a professional translator. You translate English survey questions into ${languageName} accurately, preserving intent. Always respond with valid JSON only.`,
    prompt
  );

  if (!parsed || !Array.isArray(parsed.items)) {
    console.warn(
      `Translation to ${language} failed or returned an unexpected shape. Falling back to English.`
    );
    return questions;
  }

  const byId = new Map(parsed.items.map((item) => [item.id, item]));
  return questions.map((q) => {
    const translated = byId.get(q.id);
    if (!translated || typeof translated.question !== "string") return q;
    return { ...q, question: translated.question };
  });
}

async function getQuestionsInLanguage(
  language: string
): Promise<QuestionRow[]> {
  const english = await loadEnglishQuestions();

  if (language === DEFAULT_LANGUAGE) return english;

  const cached = questionCache.get(language);
  if (cached && cached.length === english.length) {
    return cached;
  }

  try {
    const translated = await translateQuestions(english, language);
    questionCache.set(language, translated);
    return translated;
  } catch (error) {
    console.error(`Failed to translate questions to ${language}:`, error);
    return english;
  }
}

const app = new Elysia()
  .use(cors())
  .get("/", () => {
    return { message: "Quiz API is running" };
  })
  .get("/questions", async ({ query }) => {
    try {
      const language = normalizeLanguage(
        (query as { lang?: string } | undefined)?.lang
      );
      const questions = await getQuestionsInLanguage(language);
      return { questions, language };
    } catch (error) {
      console.error("Error fetching questions:", error);
      return {
        error: "Failed to fetch questions",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })
  .post("/analyze", async ({ body }) => {
    try {
      const { answers, questions, additionalInfo, language } = body as {
        answers: number[];
        questions: AnswerQuestion[];
        additionalInfo?: string;
        language?: string;
      };

      if (!answers || !questions || answers.length !== questions.length) {
        return { error: "Invalid request: answers and questions must match" };
      }

      const lang = normalizeLanguage(language);
      const responses = formatQuizResponses(answers, questions, additionalInfo);

      const prompt = `You are a career counselor analyzing a personality and career assessment quiz. Based on the user's responses, recommend the most suitable job profile.

${responses}
Based on these responses, provide a career recommendation in JSON format with the following structure:
{
  "title": "Job Title",
  "description": "Detailed description explaining why this career matches the user's personality and preferences (2-3 sentences)",
  "matchScore": 85,
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "salary": "Salary range (e.g., '$80,000 - $120,000')",
  "growth": "Job growth projection (e.g., '15% growth expected')"
}

Keep the career recommendation thoughtful and based on the response patterns. The matchScore should be between 75-98. Provide 4-6 key skills.
${languageInstruction(lang)}
Always return valid JSON only. Do not include courses or jobs fields in this response.`;

      const recommendation = await runJsonCompletion<{
        title: string;
        description: string;
        matchScore: number;
        skills: string[];
        salary: string;
        growth: string;
      }>(
        "You are an expert career counselor who analyzes personality assessments and provides thoughtful, personalized career recommendations. Always respond with valid JSON only.",
        prompt
      );

      if (!recommendation) {
        return { error: "Failed to generate recommendation" };
      }

      return { recommendation };
    } catch (error) {
      console.error("Error analyzing answers:", error);
      return {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })
  .post("/courses", async ({ body }) => {
    try {
      const { career, answers, questions, additionalInfo, language } = body as {
        career: {
          title: string;
          description?: string;
          skills?: string[];
        };
        answers?: number[];
        questions?: AnswerQuestion[];
        additionalInfo?: string;
        language?: string;
      };

      if (!career || !career.title) {
        return { error: "Invalid request: career.title is required" };
      }

      const lang = normalizeLanguage(language);
      const responseContext =
        answers && questions && answers.length === questions.length
          ? formatQuizResponses(answers, questions, additionalInfo)
          : "";

      const prompt = `You are a career counselor recommending learning resources for a user who has been matched with the career: "${career.title}".

${career.description ? `Career description: ${career.description}\n` : ""}${
        career.skills && career.skills.length > 0
          ? `Key skills for this role: ${career.skills.join(", ")}\n`
          : ""
      }
${responseContext ? `For additional context, here is the user's quiz data:\n${responseContext}` : ""}
Recommend 4 high-quality, practical courses that will help this user grow into the "${career.title}" role. Return JSON in this exact shape:
{
  "courses": [
    {
      "title": "Course title",
      "provider": "Platform or institution name (e.g., Coursera, edX, Udemy, LinkedIn Learning, MIT OCW)",
      "reason": "Why this course helps for this career (1 sentence)",
      "url": "Direct URL to the course page on the provider's website"
    }
  ]
}

For every course, include a real, working "url". Only use well-known, publicly reachable platforms (Coursera, edX, Udemy, LinkedIn Learning, official university pages, etc.). If you are not confident a specific course page exists, use a search URL on that platform instead (e.g., https://www.coursera.org/search?query=...).
${languageInstruction(lang)}
Always return valid JSON only.`;

      const parsed = await runJsonCompletion<{
        courses?: Array<{
          title: string;
          provider: string;
          reason: string;
          url?: string;
        }>;
      }>(
        "You are an expert career counselor recommending concrete learning resources. Always respond with valid JSON only.",
        prompt
      );

      if (!parsed) {
        return { error: "Failed to generate course recommendations" };
      }

      const courses = Array.isArray(parsed.courses)
        ? parsed.courses.slice(0, 4)
        : [];

      return { courses };
    } catch (error) {
      console.error("Error generating courses:", error);
      return {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })
  .post("/jobs", async ({ body }) => {
    try {
      const { career, answers, questions, additionalInfo, language } = body as {
        career: {
          title: string;
          description?: string;
          skills?: string[];
        };
        answers?: number[];
        questions?: AnswerQuestion[];
        additionalInfo?: string;
        language?: string;
      };

      if (!career || !career.title) {
        return { error: "Invalid request: career.title is required" };
      }

      const lang = normalizeLanguage(language);
      const responseContext =
        answers && questions && answers.length === questions.length
          ? formatQuizResponses(answers, questions, additionalInfo)
          : "";

      const prompt = `You are a career counselor recommending job opportunities for a user who has been matched with the career: "${career.title}".

${career.description ? `Career description: ${career.description}\n` : ""}${
        career.skills && career.skills.length > 0
          ? `Key skills for this role: ${career.skills.join(", ")}\n`
          : ""
      }
${responseContext ? `For additional context, here is the user's quiz data:\n${responseContext}` : ""}
Recommend 4 realistic job opportunities that match the "${career.title}" career and would be accessible to someone entering this path. Return JSON in this exact shape:
{
  "jobs": [
    {
      "title": "Job role title",
      "company": "Company name",
      "location": "City, Country or Remote",
      "reason": "Why this role is a strong fit (1 sentence)",
      "url": "URL to the job listing or the company's careers page"
    }
  ]
}

For every job, include a real, working "url". Only use well-known, publicly reachable platforms (LinkedIn Jobs, Indeed, official company careers pages, etc.). If you are not confident a specific listing exists, use a search URL on that platform instead (e.g., https://www.linkedin.com/jobs/search/?keywords=...).
${languageInstruction(lang)}
Always return valid JSON only.`;

      const parsed = await runJsonCompletion<{
        jobs?: Array<{
          title: string;
          company: string;
          location: string;
          reason: string;
          url?: string;
        }>;
      }>(
        "You are an expert career counselor recommending concrete job opportunities. Always respond with valid JSON only.",
        prompt
      );

      if (!parsed) {
        return { error: "Failed to generate job recommendations" };
      }

      const jobs = Array.isArray(parsed.jobs) ? parsed.jobs.slice(0, 4) : [];

      return { jobs };
    } catch (error) {
      console.error("Error generating jobs:", error);
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
