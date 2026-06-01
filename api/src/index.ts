import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { getQuestionsCollection } from "./db";
import {
  DEFAULT_LANGUAGE,
  getLanguageName,
  normalizeLanguage,
} from "./languages";

const PORT = Number(process.env.PORT) || 3000;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

type AnswerQuestion = { id: number; question: string };

interface QuestionRow {
  id: number;
  question: string;
  category: string;
  translations?: Record<string, string>;
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

async function getQuestionsInLanguage(
  language: string
): Promise<Array<Pick<QuestionRow, "id" | "question" | "category">>> {
  const collection = await getQuestionsCollection();
  const rows = (await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray()) as unknown as QuestionRow[];

  if (language === DEFAULT_LANGUAGE) {
    return rows.map(({ id, question, category }) => ({ id, question, category }));
  }

  return rows.map(({ id, question, category, translations }) => ({
    id,
    category,
    question:
      (translations && translations[language]) || question,
  }));
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Quiz API is running" });
});

app.get("/questions", async (req, res) => {
  try {
    const language = normalizeLanguage(
      typeof req.query.lang === "string" ? req.query.lang : undefined
    );
    const questions = await getQuestionsInLanguage(language);
    res.json({ questions, language });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.json({
      error: "Failed to fetch questions",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/analyze", async (req, res) => {
  try {
    const { answers, questions, additionalInfo, language } = req.body as {
      answers: number[];
      questions: AnswerQuestion[];
      additionalInfo?: string;
      language?: string;
    };

    if (!answers || !questions || answers.length !== questions.length) {
      res.json({ error: "Invalid request: answers and questions must match" });
      return;
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
      res.json({ error: "Failed to generate recommendation" });
      return;
    }

    res.json({ recommendation });
  } catch (error) {
    console.error("Error analyzing answers:", error);
    res.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/courses", async (req, res) => {
  try {
    const { career, answers, questions, additionalInfo, language } = req.body as {
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
      res.json({ error: "Invalid request: career.title is required" });
      return;
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
      res.json({ error: "Failed to generate course recommendations" });
      return;
    }

    const courses = Array.isArray(parsed.courses)
      ? parsed.courses.slice(0, 4)
      : [];

    res.json({ courses });
  } catch (error) {
    console.error("Error generating courses:", error);
    res.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/jobs", async (req, res) => {
  try {
    const { career, answers, questions, additionalInfo, language } = req.body as {
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
      res.json({ error: "Invalid request: career.title is required" });
      return;
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
      res.json({ error: "Failed to generate job recommendations" });
      return;
    }

    const jobs = Array.isArray(parsed.jobs) ? parsed.jobs.slice(0, 4) : [];

    res.json({ jobs });
  } catch (error) {
    console.error("Error generating jobs:", error);
    res.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Quiz API running at http://localhost:${PORT}`);
});
