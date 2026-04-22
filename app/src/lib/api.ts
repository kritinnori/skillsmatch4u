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

export interface CareerCore {
  title: string;
  description: string;
  matchScore: number;
  skills: string[];
  salary: string;
  growth: string;
}

export interface CourseRecommendation {
  title: string;
  provider: string;
  reason: string;
  url?: string;
}

export interface JobRecommendation {
  title: string;
  company: string;
  location: string;
  reason: string;
  url?: string;
}

export interface CareerRecommendation extends CareerCore {
  courses: CourseRecommendation[];
  jobs: JobRecommendation[];
}

export async function analyzeAnswers(
  request: AnalyzeRequest
): Promise<CareerCore> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to analyze answers");
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.recommendation;
}

export interface RecommendationRequest extends AnalyzeRequest {
  career: Pick<CareerCore, "title" | "description" | "skills">;
}

export async function fetchCourseRecommendations(
  request: RecommendationRequest
): Promise<CourseRecommendation[]> {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch course recommendations");
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return Array.isArray(data.courses) ? data.courses : [];
}

export async function fetchJobRecommendations(
  request: RecommendationRequest
): Promise<JobRecommendation[]> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch job recommendations");
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return Array.isArray(data.jobs) ? data.jobs : [];
}
