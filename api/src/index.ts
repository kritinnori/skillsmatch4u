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
// gpt-4.1-mini: best latency/quality balance for structured JSON (benchmarked vs gpt-5, nano, 4o-mini).
// Override via OPENAI_MODEL if needed.
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  timeout: 30 * 1000,
  // Force Node's native fetch (available in Node 18+) instead of the SDK's bundled
  // node-fetch, which has a known ERR_STREAM_PREMATURE_CLOSE bug on some hosts
  // (including Render) when gzip-decompressing chat completion responses.
  fetch: globalThis.fetch,
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

function formatCareerContext(career: {
  title: string;
  description?: string;
  skills?: string[];
}): string {
  let section = `Career match: ${career.title}\n`;
  if (career.description?.trim()) {
    section += `Description: ${career.description.trim()}\n`;
  }
  if (career.skills && career.skills.length > 0) {
    section += `Key skills: ${career.skills.join(", ")}\n`;
  }
  return section;
}

function formatMs(ms: number): string {
  return `${ms.toFixed(0)}ms`;
}

function logBenchmark(
  label: string,
  timings: {
    aiMs: number;
    parseMs?: number;
    requestMs?: number;
    promptTokens?: number;
    completionTokens?: number;
  }
): void {
  const parts = [
    `[benchmark] ${label}`,
    `ai=${formatMs(timings.aiMs)}`,
  ];

  if (timings.parseMs !== undefined) {
    parts.push(`parse=${formatMs(timings.parseMs)}`);
  }
  if (timings.requestMs !== undefined) {
    parts.push(`request=${formatMs(timings.requestMs)}`);
  }
  if (
    timings.promptTokens !== undefined &&
    timings.completionTokens !== undefined
  ) {
    parts.push(
      `tokens=${timings.promptTokens}+${timings.completionTokens}=${timings.promptTokens + timings.completionTokens}`
    );
  }

  parts.push(`model=${OPENAI_MODEL}`);
  console.log(parts.join(" "));
}

function logRequestTotal(label: string, requestStarted: number): void {
  console.log(
    `[benchmark] ${label} request=${formatMs(performance.now() - requestStarted)}`
  );
}

async function runJsonCompletion<T>(
  label: string,
  systemPrompt: string,
  userPrompt: string
): Promise<T | null> {
  const aiStarted = performance.now();

  // Retry logic: real production apps don't give up after one dropped connection.
  // OpenAI (and any LLM API) can occasionally drop a streaming/network connection
  // (e.g. ERR_STREAM_PREMATURE_CLOSE) especially right after a cold server start.
  // We retry up to 2 extra times with a short backoff before giving up entirely.
  const MAX_ATTEMPTS = 3;
  let completion;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      console.warn(
        `[benchmark] ${label} attempt=${attempt}/${MAX_ATTEMPTS} ai=failed after ${formatMs(performance.now() - aiStarted)} model=${OPENAI_MODEL}`,
        error
      );
      if (attempt < MAX_ATTEMPTS) {
        // Short backoff before retrying: 500ms, then 1000ms
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  if (lastError || !completion) {
    console.error(
      `[benchmark] ${label} ai=failed after ${MAX_ATTEMPTS} attempts, ${formatMs(performance.now() - aiStarted)} model=${OPENAI_MODEL}`,
      lastError
    );
    throw lastError ?? new Error("AI completion failed with no response");
  }

  const aiMs = performance.now() - aiStarted;
  const usage = completion.usage;

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    logBenchmark(label, {
      aiMs,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
    });
    console.warn(`[benchmark] ${label} empty content from OpenAI`);
    return null;
  }

  const parseStarted = performance.now();
  try {
    const parsed = JSON.parse(content) as T;
    logBenchmark(label, {
      aiMs,
      parseMs: performance.now() - parseStarted,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
    });
    return parsed;
  } catch (parseError) {
    logBenchmark(label, {
      aiMs,
      parseMs: performance.now() - parseStarted,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
    });
    console.error(`[benchmark] ${label} JSON parse error:`, parseError);
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
  const requestStarted = performance.now();
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

    const prompt = `You are a career counselor in India analyzing a personality and career assessment quiz. Based on the user's responses, recommend the most suitable job profile for the Indian job market.

${responses}
Based on these responses, provide a career recommendation in JSON format with the following structure:
{
  "title": "Job Title",
  "description": "Detailed description explaining why this career matches the user's personality and preferences (2-3 sentences)",
  "matchScore": 85,
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "salary": "Typical annual salary range in India in INR (e.g., '₹6 LPA - ₹12 LPA' or '₹8,00,000 - ₹15,00,000 per year')",
  "growth": "Job growth outlook in India (e.g., 'Strong demand in Indian tech and services sectors')"
}

Keep the career recommendation thoughtful and based on the response patterns. The matchScore should be between 75-98. Provide 4-6 key skills.

CURRENCY RULE (strict): The "salary" value must always be in Indian Rupees, using the ₹ symbol and Indian conventions such as "LPA" (lakhs per annum) — e.g. "₹6 LPA - ₹12 LPA" or "₹8,00,000 - ₹15,00,000 per year". Never use US dollars, the "$" symbol, "USD", or any non-Indian currency anywhere in the response.
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
      "POST /analyze",
      "You are an expert career counselor in India who analyzes personality assessments and provides thoughtful, personalized career recommendations for the Indian job market. Always respond with valid JSON only.",
      prompt
    );

    if (!recommendation) {
      logRequestTotal("POST /analyze", requestStarted);
      res.json({ error: "Failed to generate recommendation" });
      return;
    }

    logRequestTotal("POST /analyze", requestStarted);
    res.json({ recommendation });
  } catch (error) {
    console.error(
      `[benchmark] POST /analyze request=failed after ${formatMs(performance.now() - requestStarted)}`
    );
    console.error("Error analyzing answers:", error);
    res.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/courses", async (req, res) => {
  const requestStarted = performance.now();
  try {
    const { career, language } = req.body as {
      career: {
        title: string;
        description?: string;
        skills?: string[];
      };
      language?: string;
    };

    if (!career || !career.title) {
      res.json({ error: "Invalid request: career.title is required" });
      return;
    }

    const lang = normalizeLanguage(language);
    const careerContext = formatCareerContext(career);

    const prompt = `You are a career counselor in India recommending learning resources based on this career match:

${careerContext}
Recommend 4 high-quality, practical courses that will help this user grow into the "${career.title}" role in the Indian job market. Return JSON in this exact shape:
{
  "courses": [
    {
      "title": "Course title",
      "provider": "Platform or institution name",
      "reason": "Why this course helps for this career in India (1 sentence; mention affordability, Hindi/regional language, or India-relevant skills where applicable)",
      "url": "A search/listing URL on the provider's site for this course topic (see URL rules below — never a guessed direct course page)"
    }
  ]
}

India-specific requirements:
- Prioritize resources accessible and valuable to learners in India: affordable pricing (INR), India-relevant examples, and skills demanded by Indian employers.
- Strongly prefer vocational and skill-based pathways common in India, not only online degrees:
  - ITI (Industrial Training Institute): government-recognized 1–2 year trade programs (e.g. Electrician, Fitter, Turner, Welder, COPA — Computer Operator & Programming Assistant, Mechanic, Electronics). Name the specific ITI trade when relevant. Provider: "ITI" or "Government ITI / DGT".
  - Polytechnic diploma programs (state polytechnics)
  - NSDC / Skill India, PMKVY (Pradhan Mantri Kaushal Vikas Yojana), sector skill councils
  - Apprenticeship-linked or NCVT/SCVT-certified vocational training
- Also include where relevant:
  - Free/government academic: NPTEL (https://nptel.ac.in), SWAYAM (https://swayam.gov.in)
  - Indian platforms: upGrad, Unacademy, Great Learning, Scaler, Simplilearn, NIIT, Internshala Trainings
  - Global platforms widely used in India: Coursera, edX, Udemy, LinkedIn Learning
  - Indian universities, IITs, and IIMs
- Include at least 1 vocational pathway (ITI trade, polytechnic diploma, or NSDC/Skill India program) when the career can be entered via hands-on or trade skills — which is true for many technical, operations, healthcare support, hospitality, and skilled-labor roles.
- Include at least 1 course from NPTEL, SWAYAM, or an India-based online platform when suitable.
- Reasons should mention entry-level access, low cost, government recognition (NCVT/SCVT), or direct employability in Indian industry where applicable.

CRITICAL URL RULE — links must never 404:
- NEVER invent or guess a specific course page URL (e.g. never make up "/course/data-analytics-101" style paths). Specific guessed URLs are very likely to 404 and are forbidden.
- ALWAYS use a search or category-listing URL on the real platform's actual domain, built from the course title/topic, using these exact patterns:
  - ITI / DGT: https://www.dgt.gov.in/ or https://iti.dgt.gov.in/
  - Skill India: https://www.skillindia.gov.in/search?search=<topic>
  - NPTEL: https://nptel.ac.in/courses?searchText=<topic>
  - SWAYAM: https://swayam.gov.in/search?searchText=<topic>
  - Coursera: https://www.coursera.org/search?query=<topic>
  - edX: https://www.edx.org/search?q=<topic>
  - Udemy: https://www.udemy.com/courses/search/?q=<topic>
  - upGrad: https://www.upgrad.com/search/?q=<topic>
  - Simplilearn: https://www.simplilearn.com/search?q=<topic>
  - Great Learning: https://www.mygreatlearning.com/search?query=<topic>
  - Internshala Trainings: https://trainings.internshala.com/search/?search_term=<topic>
  - LinkedIn Learning: https://www.linkedin.com/learning/search?keywords=<topic>
- URL-encode the topic (spaces as %20 or +). These listing/search pages always load successfully even if the exact course name varies slightly — this is mandatory to avoid broken links.
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
      "POST /courses",
      "You are an expert career counselor specializing in the Indian job market, including vocational routes (ITI, polytechnic, NSDC) and online upskilling. Recommend practical, realistic pathways for candidates in India. Always respond with valid JSON only.",
      prompt
    );

    if (!parsed) {
      logRequestTotal("POST /courses", requestStarted);
      res.json({ error: "Failed to generate course recommendations" });
      return;
    }

    const courses = Array.isArray(parsed.courses)
      ? parsed.courses.slice(0, 4)
      : [];

    logRequestTotal("POST /courses", requestStarted);
    res.json({ courses });
  } catch (error) {
    console.error(
      `[benchmark] POST /courses request=failed after ${formatMs(performance.now() - requestStarted)}`
    );
    console.error("Error generating courses:", error);
    res.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/jobs", async (req, res) => {
  const requestStarted = performance.now();
  try {
    const { career, language } = req.body as {
      career: {
        title: string;
        description?: string;
        skills?: string[];
      };
      language?: string;
    };

    if (!career || !career.title) {
      res.json({ error: "Invalid request: career.title is required" });
      return;
    }

    const lang = normalizeLanguage(language);
    const careerContext = formatCareerContext(career);

    const prompt = `You are a career counselor in India recommending job opportunities based on this career match:

${careerContext}
Recommend 4 realistic job opportunities in India that match the "${career.title}" career and would be accessible to someone entering this path in the Indian job market. Return JSON in this exact shape:
{
  "jobs": [
    {
      "title": "Job role title (use titles common in India, e.g. Analyst, Associate, Executive)",
      "company": "Company name",
      "location": "Indian city and state, or Remote (India)",
      "reason": "Why this role is a strong fit for a candidate in India (1 sentence)",
      "url": "URL to the job listing or careers page"
    }
  ]
}

India-specific requirements:
- All roles must be based in India: use cities such as Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, or Remote (India).
- Prefer employers active in India: Indian companies (e.g. TCS, Infosys, Wipro, HCL, Flipkart, Swiggy, Zomato, Razorpay, BYJU'S), startups, and India offices of global firms (e.g. Amazon India, Google India, Microsoft India).
- Mix entry-level and early-career roles where appropriate for someone new to the field.
- Location must always include India (never US-only or generic "Remote" without India context).

For every job, include a real, working "url". Prefer India-focused job platforms and careers pages:
- Naukri.com (https://www.naukri.com/...)
- LinkedIn Jobs India (https://www.linkedin.com/jobs/search/?keywords=...&location=India)
- Indeed India (https://in.indeed.com/jobs?q=...&l=...)
- Foundit / Monster India, Instahyre, or official company India careers pages
If you are not confident a specific listing exists, use a search URL on one of these platforms filtered for India.
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
      "POST /jobs",
      "You are an expert career counselor specializing in the Indian job market. Recommend concrete, realistic opportunities for candidates in India. Always respond with valid JSON only.",
      prompt
    );

    if (!parsed) {
      logRequestTotal("POST /jobs", requestStarted);
      res.json({ error: "Failed to generate job recommendations" });
      return;
    }

    const jobs = Array.isArray(parsed.jobs) ? parsed.jobs.slice(0, 4) : [];

    logRequestTotal("POST /jobs", requestStarted);
    res.json({ jobs });
  } catch (error) {
    console.error(
      `[benchmark] POST /jobs request=failed after ${formatMs(performance.now() - requestStarted)}`
    );
    console.error("Error generating jobs:", error);
    res.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});


app.post("/local-industries", async (req, res) => {
  const requestStarted = performance.now();
  try {
    const { state, district, career, language } = req.body as {
      state: string;
      district?: string;
      career?: { title: string };
      language?: string;
    };

    if (!state) {
      res.json({ error: "Invalid request: state is required" });
      return;
    }

    const lang = normalizeLanguage(language);
    const locationLabel = district ? `${district}, ${state}` : state;
    const careerNote = career?.title
      ? `The student was matched to "${career.title}" by a career assessment. If that career is NOT among the thriving local industries, mention this gently as an alternative worth exploring.`
      : "";

    const prompt = `You are a regional labor-market analyst in India. Identify thriving industries and employment opportunities near "${locationLabel}".

${careerNote}

Return JSON in this exact shape:
{
  "location": "${locationLabel}",
  "industries": [
    {
      "name": "Industry or sector name",
      "reason": "Why this industry is thriving near this location specifically (1-2 sentences, mention real regional factors like local manufacturing hubs, agriculture, ports, IT corridors, etc. if known)",
      "matchesUserCareer": false
    }
  ]
}

Requirements:
- Identify 3 real, regionally-grounded thriving industries near this specific location in India — not generic national trends.
- Base this on actual known economic activity in or near that district/state (e.g. textiles in Tamil Nadu districts, pharma in Hyderabad, IT in Bengaluru/Pune, manufacturing belts, agriculture/agri-processing in rural districts, ports/logistics in coastal areas).
- If the student's matched career (above) aligns with one of these industries, set "matchesUserCareer": true for that entry.
- Keep reasons concrete and specific to the location, not generic platitudes.
${languageInstruction(lang)}
Always return valid JSON only.`;

    const parsed = await runJsonCompletion<{
      location?: string;
      industries?: Array<{
        name: string;
        reason: string;
        matchesUserCareer?: boolean;
      }>;
    }>(
      "POST /local-industries",
      "You are a regional economic analyst specializing in India's district-level labor markets. Ground every recommendation in real, specific regional economic activity. Always respond with valid JSON only.",
      prompt
    );

    if (!parsed) {
      logRequestTotal("POST /local-industries", requestStarted);
      res.json({ error: "Failed to generate local industry recommendations" });
      return;
    }

    const industries = Array.isArray(parsed.industries) ? parsed.industries.slice(0, 3) : [];

    logRequestTotal("POST /local-industries", requestStarted);
    res.json({ location: parsed.location ?? locationLabel, industries });
  } catch (error) {
    console.error(
      `[benchmark] POST /local-industries request=failed after ${formatMs(performance.now() - requestStarted)}`
    );
    console.error("Error generating local industries:", error);
    res.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Quiz API running at http://localhost:${PORT}`);
});
