import type { Question } from "../types/question";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://skillsmatch4u.onrender.com";

export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/questions`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  const data = await response.json();
  return data.questions || [];
}

export interface AnalyzeRequest {
  answers: number[];
  questions: Question[];
  additionalInfo?: string;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  matchScore: number;
  skills: string[];
  salary: string;
  growth: string;
  courses: CourseRecommendation[];
  jobs: JobRecommendation[];
}

export interface CourseRecommendation {
  title: string;
  provider: string;
  reason: string;
}

export interface JobRecommendation {
  title: string;
  company: string;
  location: string;
  reason: string;
}

export async function analyzeAnswers(
  request: AnalyzeRequest
): Promise<CareerRecommendation> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to analyze answers");
  }

  const data = await response.json();
  return data.recommendation;
}
