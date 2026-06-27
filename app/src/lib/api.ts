import type { Question } from "../types/question";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://skillsmatch4u.onrender.com";

function withLanguageQuery(path: string, language?: string) {
  if (!language) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${encodeURIComponent(language)}`;
}

export async function fetchQuestions(language?: string): Promise<Question[]> {
  const response = await fetch(
    `${API_BASE_URL}${withLanguageQuery("/questions", language)}`
  );
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
  language?: string;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to analyze answers");
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.recommendation;
}

export interface RecommendationRequest {
  career: Pick<CareerCore, "title" | "description" | "skills">;
  language?: string;
}

export async function fetchCourseRecommendations(
  request: RecommendationRequest
): Promise<CourseRecommendation[]> {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch course recommendations");
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return Array.isArray(data.courses) ? data.courses : [];
}

export async function fetchJobRecommendations(
  request: RecommendationRequest
): Promise<JobRecommendation[]> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch job recommendations");
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return Array.isArray(data.jobs) ? data.jobs : [];
}

export interface LocalIndustry {
  name: string;
  reason: string;
  matchesUserCareer?: boolean;
}

export interface LocalIndustriesRequest {
  state: string;
  district?: string;
  career?: { title: string };
  language?: string;
}

export async function fetchLocalIndustries(
  request: LocalIndustriesRequest
): Promise<{ location: string; industries: LocalIndustry[] }> {
  const response = await fetch(`${API_BASE_URL}/local-industries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch local industry recommendations");
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return {
    location: data.location ?? request.district ?? request.state,
    industries: Array.isArray(data.industries) ? data.industries : [],
  };
}

export interface JobByDistance {
  title: string;
  company: string;
  city: string;
  reason: string;
  distanceKm: number | null;
}

export interface JobsByDistanceRequest {
  state: string;
  district?: string;
  career?: { title: string };
  language?: string;
}

export async function fetchJobsByDistance(
  request: JobsByDistanceRequest
): Promise<{ userLocation: string; jobs: JobByDistance[] }> {
  const response = await fetch(`${API_BASE_URL}/jobs-by-distance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch nearby job opportunities");
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return {
    userLocation: data.userLocation ?? request.district ?? request.state,
    jobs: Array.isArray(data.jobs) ? data.jobs : [],
  };
}
