import { getAccessToken } from "./auth";
import { API_BASE_URL } from "./api";
import type { CareerCore, CourseRecommendation, JobRecommendation } from "./api";

export interface ClickedItem {
  title: string;
  provider?: string;
  company?: string;
  url: string;
  clickedAt: string;
}

export interface UserProgress {
  career_title: string | null;
  career_match_score: number | null;
  career_salary: string | null;
  career_growth: string | null;
  career_description: string | null;
  career_skills: string[];
  courses_clicked: ClickedItem[];
  jobs_clicked: ClickedItem[];
  courses_completed: ClickedItem[];
  recommended_courses: CourseRecommendation[];
  recommended_jobs: JobRecommendation[];
  quiz_completed_at: string | null;
  updated_at: string | null;
}

// --- API helpers (user progress is now stored in DynamoDB via backend) ---

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

// Save (or update) the user's career match result after a quiz completes
export async function saveCareerResult(_userId: string, career: CareerCore) {
  try {
    await authFetch("/user-progress", {
      method: "PUT",
      body: JSON.stringify({
        career_title: career.title,
        career_match_score: career.matchScore,
        career_salary: career.salary,
        career_growth: career.growth,
        career_description: career.description,
        career_skills: career.skills,
        quiz_completed_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Failed to save career result:", error);
  }
}

// Save the FULL recommended courses/jobs list (shown on dashboard even before any clicks)
export async function saveRecommendedCourses(_userId: string, courses: CourseRecommendation[]) {
  try {
    await authFetch("/user-progress", {
      method: "PUT",
      body: JSON.stringify({ recommended_courses: courses }),
    });
  } catch (error) {
    console.error("Failed to save recommended courses:", error);
  }
}

export async function saveRecommendedJobs(_userId: string, jobs: JobRecommendation[]) {
  try {
    await authFetch("/user-progress", {
      method: "PUT",
      body: JSON.stringify({ recommended_jobs: jobs }),
    });
  } catch (error) {
    console.error("Failed to save recommended jobs:", error);
  }
}

// Log a course click — appends to the courses_clicked array
export async function logCourseClick(_userId: string, item: Omit<ClickedItem, "clickedAt">) {
  try {
    await authFetch("/user-progress/click", {
      method: "POST",
      body: JSON.stringify({ type: "course", item }),
    });
  } catch (err) {
    console.error("Failed to log course click:", err);
  }
}

// Log a job click — appends to the jobs_clicked array
export async function logJobClick(_userId: string, item: Omit<ClickedItem, "clickedAt">) {
  try {
    await authFetch("/user-progress/click", {
      method: "POST",
      body: JSON.stringify({ type: "job", item }),
    });
  } catch (err) {
    console.error("Failed to log job click:", err);
  }
}

// Mark a course as fully completed by the user
export async function markCourseComplete(_userId: string, item: Omit<ClickedItem, "clickedAt">) {
  try {
    await authFetch("/user-progress/complete-course", {
      method: "POST",
      body: JSON.stringify({ item }),
    });
  } catch (err) {
    console.error("Failed to mark course complete:", err);
  }
}

// Undo a completion mark
export async function unmarkCourseComplete(_userId: string, title: string) {
  try {
    await authFetch("/user-progress/uncomplete-course", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  } catch (err) {
    console.error("Failed to unmark course complete:", err);
  }
}

// Fetch the user's full dashboard data
export async function fetchUserProgress(_userId: string): Promise<UserProgress | null> {
  try {
    const res = await authFetch("/user-progress");
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.error) return null;

    return {
      career_title: data.career_title ?? null,
      career_match_score: data.career_match_score ?? null,
      career_salary: data.career_salary ?? null,
      career_growth: data.career_growth ?? null,
      career_description: data.career_description ?? null,
      career_skills: data.career_skills ?? [],
      courses_clicked: data.courses_clicked ?? [],
      jobs_clicked: data.jobs_clicked ?? [],
      courses_completed: data.courses_completed ?? [],
      recommended_courses: data.recommended_courses ?? [],
      recommended_jobs: data.recommended_jobs ?? [],
      quiz_completed_at: data.quiz_completed_at ?? null,
      updated_at: data.updated_at ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch user progress:", error);
    return null;
  }
}
