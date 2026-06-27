import { supabase } from "./supabase";
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

// Save (or update) the user's career match result after a quiz completes
export async function saveCareerResult(userId: string, career: CareerCore) {
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        career_title: career.title,
        career_match_score: career.matchScore,
        career_salary: career.salary,
        career_growth: career.growth,
        career_description: career.description,
        career_skills: career.skills,
        quiz_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  if (error) console.error("Failed to save career result:", error);
}


// Save the FULL recommended courses/jobs list (shown on dashboard even before any clicks)
export async function saveRecommendedCourses(userId: string, courses: CourseRecommendation[]) {
  const { error } = await supabase
    .from("user_progress")
    .update({ recommended_courses: courses, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) console.error("Failed to save recommended courses:", error);
}

export async function saveRecommendedJobs(userId: string, jobs: JobRecommendation[]) {
  const { error } = await supabase
    .from("user_progress")
    .update({ recommended_jobs: jobs, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) console.error("Failed to save recommended jobs:", error);
}

// Log a course click — appends to the courses_clicked array
export async function logCourseClick(userId: string, item: Omit<ClickedItem, "clickedAt">) {
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("courses_clicked")
      .eq("user_id", userId)
      .single();

    const existing: ClickedItem[] = data?.courses_clicked ?? [];
    // Avoid duplicate entries for the same course
    const alreadyLogged = existing.some((c) => c.title === item.title && c.url === item.url);
    const updated = alreadyLogged
      ? existing
      : [...existing, { ...item, clickedAt: new Date().toISOString() }];

    await supabase
      .from("user_progress")
      .update({ courses_clicked: updated, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } catch (err) {
    console.error("Failed to log course click:", err);
  }
}

// Log a job click — appends to the jobs_clicked array
export async function logJobClick(userId: string, item: Omit<ClickedItem, "clickedAt">) {
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("jobs_clicked")
      .eq("user_id", userId)
      .single();

    const existing: ClickedItem[] = data?.jobs_clicked ?? [];
    const alreadyLogged = existing.some((j) => j.title === item.title && j.url === item.url);
    const updated = alreadyLogged
      ? existing
      : [...existing, { ...item, clickedAt: new Date().toISOString() }];

    await supabase
      .from("user_progress")
      .update({ jobs_clicked: updated, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } catch (err) {
    console.error("Failed to log job click:", err);
  }
}


// Mark a course as fully completed by the user (manual action — there's no way to
// detect real completion on an external site like Coursera/NPTEL, so the student
// confirms it themselves via a "Mark as Complete" button)
export async function markCourseComplete(userId: string, item: Omit<ClickedItem, "clickedAt">) {
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("courses_completed")
      .eq("user_id", userId)
      .single();

    const existing: ClickedItem[] = data?.courses_completed ?? [];
    const alreadyLogged = existing.some((c) => c.title === item.title && c.url === item.url);
    const updated = alreadyLogged
      ? existing
      : [...existing, { ...item, clickedAt: new Date().toISOString() }];

    await supabase
      .from("user_progress")
      .update({ courses_completed: updated, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } catch (err) {
    console.error("Failed to mark course complete:", err);
  }
}

// Undo a completion mark (in case the user clicks it by mistake)
export async function unmarkCourseComplete(userId: string, title: string) {
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("courses_completed")
      .eq("user_id", userId)
      .single();

    const existing: ClickedItem[] = data?.courses_completed ?? [];
    const updated = existing.filter((c) => c.title !== title);

    await supabase
      .from("user_progress")
      .update({ courses_completed: updated, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } catch (err) {
    console.error("Failed to unmark course complete:", err);
  }
}

// Fetch the user's full dashboard data
export async function fetchUserProgress(userId: string): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    career_title: data.career_title,
    career_match_score: data.career_match_score,
    career_salary: data.career_salary,
    career_growth: data.career_growth,
    career_description: data.career_description,
    career_skills: data.career_skills ?? [],
    courses_clicked: data.courses_clicked ?? [],
    jobs_clicked: data.jobs_clicked ?? [],
    courses_completed: data.courses_completed ?? [],
    recommended_courses: data.recommended_courses ?? [],
    recommended_jobs: data.recommended_jobs ?? [],
    quiz_completed_at: data.quiz_completed_at,
    updated_at: data.updated_at,
  };
}
