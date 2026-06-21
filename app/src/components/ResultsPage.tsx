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
import { saveCareerResult, logCourseClick, logJobClick } from "../lib/dashboard";
import { ResultsPageSkeleton } from "./ResultsPageSkeleton";
import { ResultsSectionEmptyState } from "./ResultsSectionEmptyState";
import { Button } from "./ui/button";

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function buildCourseUrl(course: {
  title: string;
  provider: string;
  url?: string;
}): string {
  if (isValidHttpUrl(course.url)) return course.url;
  const query = encodeURIComponent(`${course.title} ${course.provider}`);
  const provider = course.provider.toLowerCase();
  const title = course.title.toLowerCase();

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

  return `https://www.google.com/search?q=${encodeURIComponent(
    `${course.title} ${course.provider} online course India`
  )}`;
}

function buildJobUrl(job: {
  title: string;
  company: string;
  url?: string;
}): string {
  if (isValidHttpUrl(job.url)) return job.url;
  const query = encodeURIComponent(`${job.title} ${job.company}`);
  return `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India`;
}

interface ResultsPageProps {
  answers: number[];
  questions: Question[];
  additionalInfo?: string;
  onRestart: () => void;
  onBack: () => void;
  user?: { email?: string } | null;
  onSignOut?: () => void;
  onDashboard?: () => void;
}

const CardSkeleton = () => (
  <div className="rounded-xl border border-purple-900/40 bg-[#111111] p-4 shadow-sm">
    <div className="h-5 w-3/4 skeleton-shimmer rounded" />
    <div className="h-3 w-1/3 skeleton-shimmer rounded mt-3" />
    <div className="h-3 w-full skeleton-shimmer rounded mt-3" />
    <div className="h-3 w-5/6 skeleton-shimmer rounded mt-2" />
  </div>
);

function ResultsShell({
  children,
  brand,
  onBack,
  backLabel,
  title,
  user,
  onSignOut,
  onHome,
  onDashboard,
}: {
  children: ReactNode;
  brand: string;
  onBack: () => void;
  backLabel: string;
  title?: string;
  user?: { email?: string } | null;
  onSignOut?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />
      <div className="relative z-10">
        <PageHeader
          brand={brand}
          onBack={onBack}
          backLabel={backLabel}
          title={title}
          user={user}
          onSignOut={onSignOut}
          onHome={onHome}
          onDashboard={onDashboard}
          sticky
        />
        <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-16">
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
      // Check cache first — instant load if already fetched for this language
      const cached = getCareerCache(language);
      if (cached) {
        setCareer(cached);
        setCareerLoading(false);
        return;
      }
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
        // Cache per language so switching language gets translated result but % stays stable within a session
        // Lock the score on first analysis, inject it on subsequent ones
        const score = lockedScore ?? recommendation.matchScore;
        if (!lockedScore) {
          sessionStorage.setItem("sm_career_score", JSON.stringify(score));
          setLockedScore(score);
        }
        const stabilized = { ...recommendation, matchScore: score };
        setCareer(stabilized);
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
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        const result = await fetchCourseRecommendations({
          language,
          career: careerContext,
        });
        if (cancelled) return;
        setCourses(result);
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
      try {
        setJobsLoading(true);
        setJobsError(null);
        const result = await fetchJobRecommendations({
          language,
          career: careerContext,
        });
        if (cancelled) return;
        setJobs(result);
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
        backLabel={t("common.goBack")}
        title={t("results.pageTitle")}
        user={user}
        onSignOut={onSignOut}
        onHome={onBack}
        onDashboard={onDashboard}
      >
        <p className="text-center text-gray-300 text-body-sm mb-8">
          {t("results.analyzingHint")}
        </p>
        <ResultsPageSkeleton
          coursesTitle={t("results.coursesTitle")}
          jobsTitle={t("results.jobsTitle")}
          keySkillsLabel={t("results.keySkills")}
        />
      </ResultsShell>
    );
  }

  if (careerError || !career) {
    return (
      <ResultsShell
        brand={brand}
        onBack={onBack}
        backLabel={t("common.goBack")}
        onHome={onBack}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center bg-[#111111] rounded-xl border border-purple-900/40 p-10 shadow-sm max-w-md">
            <p className="text-lg mb-4 text-red-400 font-medium">
              {t("common.errorPrefix")}:{" "}
              {careerError || t("results.failedToLoad")}
            </p>
            <Button
              onClick={onBack}
              className="bg-purple-700 hover:bg-purple-600 text-white"
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
      backLabel={t("common.goBack")}
      title={t("results.pageTitle")}
      user={user}
      onSignOut={onSignOut}
      onHome={onBack}
      onDashboard={onDashboard}
    >
      <div className="space-y-10">
        <div className="bg-[#111111] rounded-xl overflow-hidden shadow-lg border border-purple-900/40">
          <div className="bg-gradient-to-r from-purple-800 to-purple-950 px-6 md:px-10 py-10 text-white">
            <p className="text-body-sm font-semibold opacity-90 mb-2 uppercase tracking-wide">
              {t("results.idealCareer")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {career.title}
            </h2>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-body-sm opacity-90 mb-1">
                  {t("results.heading")}
                </p>
                <span className="text-4xl md:text-5xl font-bold">
                  {career.matchScore}%
                </span>
              </div>

              <div className="flex-1 min-w-[120px] max-w-md">
                <div className="w-full h-2.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${career.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-10 py-8 space-y-8">
            <div>
              <h3 className="text-h4 font-bold text-white mb-3">
                {t("results.aboutRole")}
              </h3>
              <p className="text-body-sm text-gray-300 leading-relaxed">
                {career.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-lg border border-purple-900/40 bg-[#1a1a1a] p-5">
                <p className="text-body-xs font-semibold text-gray-400 uppercase mb-1">
                  {t("results.salaryRange")}
                </p>
                <p className="text-lg font-bold text-white">{career.salary}</p>
              </div>

              <div className="rounded-lg border border-purple-900/40 bg-[#1a1a1a] p-5">
                <p className="text-body-xs font-semibold text-gray-400 uppercase mb-1">
                  {t("results.jobGrowth")}
                </p>
                <p className="text-lg font-bold text-white">{career.growth}</p>
              </div>
            </div>

            <div>
              <h3 className="text-body-sm font-semibold text-gray-300 uppercase mb-4 text-center">
                {t("results.keySkills")}
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {career.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-950 text-purple-200 rounded-lg text-body-sm font-medium border border-purple-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-h4 font-bold text-white text-center">
            {t("results.coursesTitle")}
          </h3>

          <a
            href="https://skillsbuild.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border-2 border-teal-700/60 bg-gradient-to-r from-teal-950/40 to-[#111111] p-5 shadow-sm transition-all hover:border-teal-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-semibold text-white group-hover:text-teal-300">
                {t("results.skillsBuildTitle", { defaultValue: "IBM SkillsBuild" })}
              </p>
              <ExternalLink className="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-teal-300" />
            </div>
            <p className="text-body-sm text-gray-400 mt-1">
              {t("results.skillsBuildProvider", { defaultValue: "Free courses & IBM digital credentials" })}
            </p>
            <p className="text-body-sm text-gray-300 mt-2">
              {t("results.skillsBuildReason", { defaultValue: "Build the skills for this career with free, self-paced IBM courses — and earn digital badges employers recognize." })}
            </p>
          </a>

          <div className="grid gap-4">
            {coursesLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : coursesError || !courses?.length ? (
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
                  className="group block rounded-xl border border-purple-900/40 bg-[#111111] p-5 shadow-sm transition-all hover:border-purple-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-lg font-semibold text-white group-hover:text-purple-300">
                      {course.title}
                    </p>
                    <ExternalLink className="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-purple-300" />
                  </div>
                  <p className="text-body-sm text-gray-400 mt-1">
                    {course.provider}
                  </p>
                  <p className="text-body-sm text-gray-300 mt-2">
                    {course.reason}
                  </p>
                </a>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-h4 font-bold text-white text-center">
            {t("results.jobsTitle")}
          </h3>

          <div className="grid gap-4">
            {jobsLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : jobsError || !jobs?.length ? (
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
                  className="group block rounded-xl border border-purple-900/40 bg-[#111111] p-5 shadow-sm transition-all hover:border-purple-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-white group-hover:text-purple-300">
                        {job.title}
                      </p>
                      <ExternalLink className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-purple-300" />
                    </div>
                    <span className="text-body-xs uppercase tracking-wide text-gray-400">
                      {job.location}
                    </span>
                  </div>
                  <p className="text-body-sm text-gray-400 mt-1">
                    {job.company}
                  </p>
                  <p className="text-body-sm text-gray-300 mt-2">
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
