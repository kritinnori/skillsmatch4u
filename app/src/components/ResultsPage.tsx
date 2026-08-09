import { useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import {
  analyzeAnswers,
  fetchCourseRecommendations,
  fetchJobRecommendations,
  type CareerCore,
  type CourseRecommendation,
  type JobRecommendation,
} from "../lib/api";
import type { Question } from "../types/question";
import { PageHeader } from "./layout/PageHeader";
import { saveCareerResult, logCourseClick, logJobClick, saveRecommendedCourses, saveRecommendedJobs, fetchUserProgress } from "../lib/dashboard";
import { ResultsPageSkeleton } from "./ResultsPageSkeleton";
import { ResultsSectionEmptyState } from "./ResultsSectionEmptyState";
import { Button } from "./ui/button";

function buildCourseUrl(course: {
  title: string;
  provider: string;
  url?: string;
}): string {
  // NOTE: we deliberately do NOT trust course.url directly, even if it's a syntactically
  // valid URL — the AI can hallucinate a specific course page that 404s. We always build
  // a search/listing URL on the real platform instead, which is guaranteed to load.
  const query = encodeURIComponent(`${course.title} ${course.provider}`);
  const provider = course.provider.toLowerCase();
  const title = course.title.toLowerCase();

  if (provider.includes("skillsbuild") || provider.includes("ibm")) {
    return "https://skillsbuild.org/";
  }

  if (
    provider.includes("iti") ||
    provider.includes("dgt") ||
    title.includes("iti")
  ) {
    return `https://iti.dgt.gov.in/`;
  }

  if (
    provider.includes("skill india") ||
    provider.includes("nsdc") ||
    provider.includes("pmkvy")
  ) {
    return `https://www.skillindia.gov.in/search?search=${query}`;
  }

  if (provider.includes("nptel")) {
    return `https://nptel.ac.in/courses?search=${query}`;
  }

  if (provider.includes("swayam")) {
    return `https://swayam.gov.in/search?searchText=${query}`;
  }

  if (provider.includes("coursera")) {
    return `https://www.coursera.org/search?query=${query}`;
  }

  if (provider.includes("edx")) {
    return `https://www.edx.org/search?q=${query}`;
  }

  if (provider.includes("udemy")) {
    return `https://www.udemy.com/courses/search/?src=ukw&q=${query}`;
  }

  if (provider.includes("upgrad")) {
    return `https://www.upgrad.com/search/?q=${query}`;
  }

  if (provider.includes("simplilearn")) {
    return `https://www.simplilearn.com/search?q=${query}`;
  }

  if (provider.includes("great learning")) {
    return `https://www.mygreatlearning.com/search?query=${query}`;
  }

  if (provider.includes("internshala")) {
    return `https://trainings.internshala.com/search/?search_term=${query}`;
  }

  if (provider.includes("linkedin")) {
    return `https://www.linkedin.com/learning/search?keywords=${query}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(
    `${course.title} ${course.provider} online course India`
  )}`;
}

function buildJobUrl(job: {
  title: string;
  company: string;
  url?: string;
}): string {
  // Same reasoning as buildCourseUrl: never trust a specific guessed job posting URL,
  // since listings expire and the AI can hallucinate. Always build a search URL instead.
  const query = encodeURIComponent(`${job.title} ${job.company}`);
  return `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India`;
}

interface ResultsPageProps {
  answers: number[];
  questions: Question[];
  additionalInfo?: string;
  onBack: () => void;
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onDashboard?: () => void;
  onViewLocalEcosystem?: () => void;
  onAddLocation?: () => void;
  onShowOpportunities?: () => void;
  onLoginRequired?: () => void;
  hasLocation?: boolean;
}

const CardSkeleton = () => (
  <div className="rounded-xl border border-purple-900/40 bg-[#111111] p-4 shadow-sm animate-pulse">
    <div className="h-5 w-3/4 bg-purple-900/30 rounded" />
    <div className="h-3 w-1/3 bg-purple-900/20 rounded mt-3" />
    <div className="h-3 w-full bg-purple-900/20 rounded mt-3" />
    <div className="h-3 w-5/6 bg-purple-900/20 rounded mt-2" />
  </div>
);

function ResultsShell({
  children,
  brand,
  onBack,
  user,
  onSignOut,
  onHome,
  onDashboard,
  onShowOpportunities,
  onLoginRequired,
}: {
  children: ReactNode;
  brand: string;
  onBack: () => void;
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  onShowOpportunities?: () => void;
  onLoginRequired?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <div className="relative z-10">
        <PageHeader
          brand={brand}
          user={user}
          onSignOut={onSignOut}
          onHome={onHome}
          onDashboard={onDashboard}
          onShowOpportunities={onShowOpportunities}
          onLoginRequired={onLoginRequired}
          sticky
        />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-12">
          {/* Back link below header */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t("common.goBack")}</span>
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}

export function ResultsPage({
  answers,
  questions,
  additionalInfo,
  onBack,
  user,
  onSignOut,
  onDashboard,
  onViewLocalEcosystem,
  onAddLocation,
  onShowOpportunities,
  onLoginRequired,
  hasLocation,
}: ResultsPageProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";

  // Load from cache if available so language changes never re-trigger analysis
  // Cache career results per language so switching back is instant
  const getCareerCache = (lang: string): CareerCore | null => {
    try {
      const raw = sessionStorage.getItem(`sm_career_${lang}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };
  const [lockedScore, setLockedScore] = useState<number | null>(() => {
    try {
      const s = sessionStorage.getItem("sm_career_score");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [career, setCareer] = useState<CareerCore | null>(() => getCareerCache(language));
  const [careerLoading, setCareerLoading] = useState(() => !getCareerCache(language));
  const [careerError, setCareerError] = useState<string | null>(null);

  const [courses, setCourses] = useState<CourseRecommendation[] | null>(null);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<JobRecommendation[] | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

  useEffect(() => {
    if (answers.length === 0 || questions.length === 0) return;

    let cancelled = false;

    const run = async () => {
      // 1. Check sessionStorage cache first — instant load
      const cached = getCareerCache(language);
      if (cached) {
        setCareer(cached);
        setCareerLoading(false);
        return;
      }

      // 2. For logged-in users, check DynamoDB (saved results)
      if (user?.id) {
        try {
          const progress = await fetchUserProgress(user.id);
          if (progress?.career_title && progress?.career_match_score) {
            const fromDb: CareerCore = {
              title: progress.career_title,
              matchScore: progress.career_match_score,
              salary: progress.career_salary || "",
              growth: progress.career_growth || "",
              description: progress.career_description || "",
              skills: progress.career_skills || [],
            };
            if (!cancelled) {
              setCareer(fromDb);
              // Cache to sessionStorage for future visits
              sessionStorage.setItem(`sm_career_${language}`, JSON.stringify(fromDb));
              sessionStorage.setItem("sm_career_score", JSON.stringify(fromDb.matchScore));
              setLockedScore(fromDb.matchScore);
              setCareerLoading(false);
              return;
            }
          }
        } catch {
          // DynamoDB fetch failed, fall through to LLM
        }
      }

      // 3. No cache, no DB result — call LLM
      try {
        setCareerLoading(true);
        setCareerError(null);
        const recommendation = await analyzeAnswers({
          answers,
          questions,
          additionalInfo,
          language,
        });
        if (cancelled) return;
        // Lock the score on first analysis
        const score = lockedScore ?? recommendation.matchScore;
        if (!lockedScore) {
          sessionStorage.setItem("sm_career_score", JSON.stringify(score));
          setLockedScore(score);
        }
        const stabilized = { ...recommendation, matchScore: score };
        setCareer(stabilized);
        // Cache to sessionStorage for instant reload
        sessionStorage.setItem(`sm_career_${language}`, JSON.stringify(stabilized));
        if (user?.id) {
          saveCareerResult(user.id, stabilized);
        }
      } catch (err) {
        if (cancelled) return;
        setCareerError(
          err instanceof Error ? err.message : t("results.failedToLoad")
        );
      } finally {
        if (!cancelled) setCareerLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questions, additionalInfo, language]);

  useEffect(() => {
    if (!career) return;

    let cancelled = false;

    const careerContext = {
      title: career.title,
      description: career.description,
      skills: career.skills,
    };

    const loadCourses = async () => {
      // 1. Check sessionStorage cache first
      try {
        const cached = sessionStorage.getItem(`sm_courses_${language}`);
        if (cached) {
          setCourses(JSON.parse(cached));
          return;
        }
      } catch { /* ignore */ }

      // 2. For logged-in users, check DynamoDB
      if (user?.id) {
        try {
          const progress = await fetchUserProgress(user.id);
          if (progress?.recommended_courses?.length) {
            if (!cancelled) {
              setCourses(progress.recommended_courses);
              sessionStorage.setItem(`sm_courses_${language}`, JSON.stringify(progress.recommended_courses));
              return;
            }
          }
        } catch { /* fall through to LLM */ }
      }

      // 3. Call LLM
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        const result = await fetchCourseRecommendations({
          language,
          career: careerContext,
        });
        if (cancelled) return;
        setCourses(result);
        sessionStorage.setItem(`sm_courses_${language}`, JSON.stringify(result));
        if (user?.id) {
          saveRecommendedCourses(user.id, result);
        }
      } catch (err) {
        if (cancelled) return;
        setCoursesError(
          err instanceof Error ? err.message : t("results.coursesError")
        );
      } finally {
        if (!cancelled) setCoursesLoading(false);
      }
    };

    const loadJobs = async () => {
      // 1. Check sessionStorage cache first
      try {
        const cached = sessionStorage.getItem(`sm_jobs_${language}`);
        if (cached) {
          setJobs(JSON.parse(cached));
          return;
        }
      } catch { /* ignore */ }

      // 2. For logged-in users, check DynamoDB
      if (user?.id) {
        try {
          const progress = await fetchUserProgress(user.id);
          if (progress?.recommended_jobs?.length) {
            if (!cancelled) {
              setJobs(progress.recommended_jobs);
              sessionStorage.setItem(`sm_jobs_${language}`, JSON.stringify(progress.recommended_jobs));
              return;
            }
          }
        } catch { /* fall through to LLM */ }
      }

      // 3. Call LLM
      try {
        setJobsLoading(true);
        setJobsError(null);
        const result = await fetchJobRecommendations({
          language,
          career: careerContext,
        });
        if (cancelled) return;
        setJobs(result);
        sessionStorage.setItem(`sm_jobs_${language}`, JSON.stringify(result));
        if (user?.id) {
          saveRecommendedJobs(user.id, result);
        }
      } catch (err) {
        if (cancelled) return;
        setJobsError(
          err instanceof Error ? err.message : t("results.jobsError")
        );
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    };

    loadCourses();
    loadJobs();

    return () => {
      cancelled = true;
    };
  }, [career, language, t]);

  const brand = t("common.brand");

  if (careerLoading) {
    return (
      <ResultsShell
        brand={brand}
        onBack={onBack}
        user={user}
        onSignOut={onSignOut}
        onHome={onBack}
        onDashboard={onDashboard}
        onShowOpportunities={onShowOpportunities}
        onLoginRequired={onLoginRequired}
      >
        <ResultsPageSkeleton />
      </ResultsShell>
    );
  }

  if (careerError || !career) {
    return (
      <ResultsShell
        brand={brand}
        onBack={onBack}
        onHome={onBack}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center bg-[#0d0d0d] rounded-2xl border border-purple-900/20 p-10 max-w-md">
            <p className="text-lg mb-4 text-red-400 font-medium">
              {t("common.errorPrefix")}:{" "}
              {careerError || t("results.failedToLoad")}
            </p>
            <Button
              onClick={onBack}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              {t("common.goBackButton")}
            </Button>
          </div>
        </div>
      </ResultsShell>
    );
  }

  return (
    <ResultsShell
      brand={brand}
      onBack={onBack}
      user={user}
      onSignOut={onSignOut}
      onHome={onBack}
      onDashboard={onDashboard}
      onShowOpportunities={onShowOpportunities}
      onLoginRequired={onLoginRequired}
    >
      <div className="space-y-6">
        {/* Career Card */}
        <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-purple-900/20">
          <div className="bg-gradient-to-r from-purple-800 to-purple-950 px-5 py-6 md:px-8 md:py-8">
            <p className="text-xs font-semibold text-purple-200 uppercase tracking-wide mb-1">
              {t("results.idealCareer")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-5">
              {career.title}
            </h2>

            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs text-purple-200 mb-1">
                  {t("results.heading")}
                </p>
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {career.matchScore}%
                </span>
              </div>

              <div className="flex-1 max-w-xs">
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${career.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 md:px-8 md:py-6 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-white mb-2">
                {t("results.aboutRole")}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {career.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-800 bg-[#0a0a0a] p-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  {t("results.salaryRange")}
                </p>
                <p className="text-lg font-bold text-white">{career.salary}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#0a0a0a] p-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  {t("results.jobGrowth")}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{career.growth}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-3 text-center">
                {t("results.keySkills")}
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {career.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-950/50 text-purple-200 rounded-lg text-xs font-medium border border-purple-800/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location CTA - Purple Theme */}
        {hasLocation && onViewLocalEcosystem ? (
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4 bg-[#120a1a] border border-purple-800/40 rounded-xl px-5 py-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300">
                {t("location.hasLocationPrompt", { defaultValue: "See what industries are thriving near you" })}
              </p>
            </div>
            <Button
              onClick={onViewLocalEcosystem}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm px-5 w-full sm:w-auto shrink-0"
            >
              {t("location.seeThriving", { defaultValue: "View Local Trends" })}
            </Button>
          </div>
        ) : (
          onAddLocation && (
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4 bg-[#120a1a] border border-purple-800/40 rounded-xl px-5 py-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">
                  {t("location.addPrompt", {
                    defaultValue: "Want to see what industries are thriving near you?",
                  })}
                </p>
              </div>
              <Button
                onClick={onAddLocation}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm px-5 w-full sm:w-auto shrink-0"
              >
                {t("location.addLocation", { defaultValue: "Add Location" })}
              </Button>
            </div>
          )
        )}

        {/* Courses Section - Blue/Teal Theme */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              {t("results.coursesTitle")}
            </h3>
          </div>

          <a
            href="https://skillsbuild.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-blue-800/50 bg-gradient-to-r from-blue-950/40 to-[#0d0d0d] p-4 transition-all hover:border-blue-500"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-base font-semibold text-white group-hover:text-blue-300">
                {t("results.skillsBuildTitle", { defaultValue: "IBM SkillsBuild" })}
              </p>
              <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-gray-500 group-hover:text-blue-300" />
            </div>
            <p className="text-xs text-blue-400/70 mt-1">
              {t("results.skillsBuildProvider", { defaultValue: "Free courses & IBM digital credentials" })}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {t("results.skillsBuildReason", { defaultValue: "Build the skills for this career with free, self-paced IBM courses — and earn digital badges employers recognize." })}
            </p>
          </a>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coursesLoading ? (
              <>
                <div className="col-span-full flex items-center gap-3 text-gray-400 mb-2">
                  <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <span className="text-sm">Loading course recommendations...</span>
                </div>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : coursesError || !courses?.length ? (
              <div className="col-span-full">
                <ResultsSectionEmptyState
                  kind="courses"
                  title={
                    coursesError
                      ? t("results.coursesUnavailableTitle")
                      : t("results.noCoursesTitle")
                  }
                  description={
                    coursesError
                      ? t("results.coursesUnavailableDescription")
                      : t("results.noCoursesDescription")
                  }
                />
              </div>
            ) : (
              courses.map((course, index) => (
                <a
                  key={`${course.title}-${index}`}
                  href={buildCourseUrl(course)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (user?.id) {
                      logCourseClick(user.id, {
                        title: course.title,
                        provider: course.provider,
                        url: buildCourseUrl(course),
                      });
                    }
                  }}
                  className="group block rounded-xl border border-blue-900/30 bg-[#0d0d0d] p-4 transition-all hover:border-blue-500 hover:bg-blue-950/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-semibold text-white group-hover:text-blue-300">
                      {course.title}
                    </p>
                    <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-gray-500 group-hover:text-blue-300" />
                  </div>
                  <p className="text-xs text-blue-400/60 mt-1">
                    {course.provider}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {course.reason}
                  </p>
                </a>
              ))
            )}
          </div>
        </section>

        {/* Jobs Section - Green/Emerald Theme */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              {t("results.jobsTitle")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {jobsLoading ? (
              <>
                <div className="col-span-full flex items-center gap-3 text-gray-400 mb-2">
                  <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-sm">Loading job recommendations...</span>
                </div>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : jobsError || !jobs?.length ? (
              <div className="col-span-full">
                <ResultsSectionEmptyState
                  kind="jobs"
                  title={
                    jobsError
                      ? t("results.jobsUnavailableTitle")
                      : t("results.noJobsTitle")
                  }
                  description={
                    jobsError
                      ? t("results.jobsUnavailableDescription")
                      : t("results.noJobsDescription")
                  }
                />
              </div>
            ) : (
              jobs.map((job, index) => (
                <a
                  key={`${job.title}-${job.company}-${index}`}
                  href={buildJobUrl(job)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (user?.id) {
                      logJobClick(user.id, {
                        title: job.title,
                        company: job.company,
                        url: buildJobUrl(job),
                      });
                    }
                  }}
                  className="group block rounded-xl border border-emerald-900/30 bg-[#0d0d0d] p-4 transition-all hover:border-emerald-500 hover:bg-emerald-950/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-semibold text-white group-hover:text-emerald-300">
                      {job.title}
                    </p>
                    <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-gray-500 group-hover:text-emerald-300" />
                  </div>
                  <p className="text-xs text-emerald-400/60 mt-1">
                    {job.company} • {job.location}
                  </p>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {job.reason}
                  </p>
                </a>
              ))
            )}
          </div>
        </section>
      </div>
    </ResultsShell>
  );
}
