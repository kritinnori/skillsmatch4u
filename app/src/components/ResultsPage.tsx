import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
import {
  analyzeAnswers,
  fetchCourseRecommendations,
  fetchJobRecommendations,
  type CareerCore,
  type CourseRecommendation,
  type JobRecommendation,
} from "../lib/api";
import type { Question } from "../types/question";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ResultsPageSkeleton } from "./ResultsPageSkeleton";
import { ResultsSectionEmptyState } from "./ResultsSectionEmptyState";

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
  const query = encodeURIComponent(`${course.title} ${course.provider} course`);
  return `https://www.google.com/search?q=${query}`;
}

function buildJobUrl(job: {
  title: string;
  company: string;
  url?: string;
}): string {
  if (isValidHttpUrl(job.url)) return job.url;
  const query = encodeURIComponent(`${job.title} ${job.company}`);
  return `https://www.linkedin.com/jobs/search/?keywords=${query}`;
}

interface ResultsPageProps {
  answers: number[];
  questions: Question[];
  additionalInfo?: string;
  onRestart: () => void;
  onBack: () => void;
}

const Logo = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      <div
        className="w-8 h-8 rounded-lg"
        style={{
          background:
            "linear-gradient(135deg, #fbbf24 0%, #f97316 25%, #10b981 50%, #3b82f6 75%, #a855f7 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
        }}
      />
      <span className="text-2xl font-bold ml-1">{label}</span>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 animate-pulse">
    <div className="h-5 w-3/4 bg-gray-800 rounded" />
    <div className="h-3 w-1/3 bg-gray-800 rounded mt-3" />
    <div className="h-3 w-full bg-gray-800 rounded mt-3" />
    <div className="h-3 w-5/6 bg-gray-800 rounded mt-2" />
  </div>
);

export function ResultsPage({
  answers,
  questions,
  additionalInfo,
  onBack,
}: ResultsPageProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";

  const [career, setCareer] = useState<CareerCore | null>(null);
  const [careerLoading, setCareerLoading] = useState(true);
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
        setCareer(recommendation);
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
  }, [answers, questions, additionalInfo, language, t]);

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
          answers,
          questions,
          additionalInfo,
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
          answers,
          questions,
          additionalInfo,
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
  }, [career, answers, questions, additionalInfo, language, t]);

  const brand = t("common.brand");

  if (careerLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={t("common.goBack")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo label={brand} />
          <LanguageSwitcher />
        </nav>

        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
          <p className="text-center text-gray-500 text-sm mb-8 pt-8">
            {t("results.analyzingHint")}
          </p>
          <ResultsPageSkeleton
            coursesTitle={t("results.coursesTitle")}
            jobsTitle={t("results.jobsTitle")}
            keySkillsLabel={t("results.keySkills")}
          />
        </div>
      </div>
    );
  }

  if (careerError || !career) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={t("common.goBack")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo label={brand} />
          <LanguageSwitcher />
        </nav>

        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-xl mb-4 text-red-500">
                {t("common.errorPrefix")}:{" "}
                {careerError || t("results.failedToLoad")}
              </div>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-purple-500 rounded-lg mt-4"
              >
                {t("common.goBackButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between p-4 md:p-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label={t("common.goBack")}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Logo label={brand} />
        <LanguageSwitcher />
      </nav>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
        <div className="space-y-8 py-12">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold tracking-tight">
              {t("results.heading")}
            </h1>
            <p className="text-md text-gray-500">
              {t("results.headingSubtitle")}
            </p>
          </div>

          <div className="text-center border-b border-gray-800 pb-8">
            <h2 className="text-5xl font-bold mb-4">{career.title}</h2>
            <p className="text-xl text-gray-500 font-light">
              {t("results.matchScore", { score: career.matchScore })}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-md text-gray-400 leading-relaxed text-center">
              {career.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <p className="text-sm uppercase tracking-wider text-gray-600 font-semibold">
                {t("results.salaryRange")}
              </p>
              <p className="text-md font-bold">{career.salary}</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm uppercase tracking-wider text-gray-600 font-semibold">
                {t("results.jobGrowth")}
              </p>
              <p className="text-md font-bold">{career.growth}</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-md uppercase tracking-wider text-gray-600 font-semibold text-center">
              {t("results.keySkills")}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {career.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-6 py-2 rounded-full border border-gray-800 bg-gray-900/50 text-base text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-5">
            <h3 className="text-md uppercase tracking-wider text-gray-600 font-semibold text-center">
              {t("results.coursesTitle")}
            </h3>
            <div className="grid gap-4">
              {coursesLoading ? (
                <>
                  <CardSkeleton />
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
                    className="group block rounded-xl border border-gray-800 bg-gray-900/40 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900/70 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-lg font-semibold group-hover:text-white">
                        {course.title}
                      </p>
                      <ExternalLink className="w-4 h-4 mt-1.5 shrink-0 text-gray-500 group-hover:text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.provider}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {course.reason}
                    </p>
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-5">
            <h3 className="text-md uppercase tracking-wider text-gray-600 font-semibold text-center">
              {t("results.jobsTitle")}
            </h3>
            <div className="grid gap-4">
              {jobsLoading ? (
                <>
                  <CardSkeleton />
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
                    className="group block rounded-xl border border-gray-800 bg-gray-900/40 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900/70 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold group-hover:text-white">
                          {job.title}
                        </p>
                        <ExternalLink className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-gray-300" />
                      </div>
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        {job.location}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                    <p className="text-sm text-gray-400 mt-2">{job.reason}</p>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl justify-center items-center flex flex-col mx-auto px-4 md:px-6 pb-8 mt-0 space-y-6">
        <div className="flex items-center gap-2 border border-gray-800 rounded-lg py-2 px-4 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-gray-700"
              />
            ))}
          </div>
          <span>{t("common.trustBadge")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gray-600 text-gray-600" />
            ))}
          </div>
          <span>{t("common.personalizedMatching")}</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-600 pt-2">
          <span>FOX</span>
          <span>CNN</span>
          <span>WSJ</span>
          <span>TechCrunch</span>
          <span>MSNBC</span>
        </div>
      </div>
    </div>
  );
}
