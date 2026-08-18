import { useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Brain, BarChart3, Code, Smartphone, TestTube2, Shield, Cloud, Users, Palette, Headphones, TrendingUp, IndianRupee, Sparkles, GraduationCap, Briefcase, MapPin, ChevronRight } from "lucide-react";
import {
  analyzeAnswers,
  fetchCourseRecommendations,
  fetchJobRecommendations,
  fetchJobsByDistance,
  type CareerCore,
  type CourseRecommendation,
  type JobRecommendation,
  type JobByDistance,
} from "../lib/api";
import type { Question } from "../types/question";
import { PageHeader } from "./layout/PageHeader";
import { saveCareerResult, logCourseClick, logJobClick, saveRecommendedCourses, saveRecommendedJobs, fetchUserProgress } from "../lib/dashboard";
import { ResultsPageSkeleton } from "./ResultsPageSkeleton";
import { ResultsSectionEmptyState } from "./ResultsSectionEmptyState";
import { Button } from "./ui/button";
import { LocationModal } from "./LocationModal";

// Modern, softer color palette for IT domains
const IT_DOMAIN_CONFIG: Record<string, {
  icon: typeof Brain;
  color: string;
  bgLight: string;
  bgGradient: string;
}> = {
  "AI & Data Science": {
    icon: Brain,
    color: "#8B5CF6",
    bgLight: "rgba(139, 92, 246, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.08) 100%)",
  },
  "Data Analytics": {
    icon: BarChart3,
    color: "#3B82F6",
    bgLight: "rgba(59, 130, 246, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)",
  },
  "Software Development": {
    icon: Code,
    color: "#10B981",
    bgLight: "rgba(16, 185, 129, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)",
  },
  "Mobile Development": {
    icon: Smartphone,
    color: "#06B6D4",
    bgLight: "rgba(6, 182, 212, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.08) 100%)",
  },
  "Testing & QA": {
    icon: TestTube2,
    color: "#F59E0B",
    bgLight: "rgba(245, 158, 11, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)",
  },
  "Cybersecurity": {
    icon: Shield,
    color: "#EF4444",
    bgLight: "rgba(239, 68, 68, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)",
  },
  "Cloud & DevOps": {
    icon: Cloud,
    color: "#0EA5E9",
    bgLight: "rgba(14, 165, 233, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.08) 100%)",
  },
  "IT Management": {
    icon: Users,
    color: "#6366F1",
    bgLight: "rgba(99, 102, 241, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%)",
  },
  "UI/UX Design": {
    icon: Palette,
    color: "#EC4899",
    bgLight: "rgba(236, 72, 153, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.08) 100%)",
  },
  "IT Support": {
    icon: Headphones,
    color: "#14B8A6",
    bgLight: "rgba(20, 184, 166, 0.1)",
    bgGradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.08) 100%)",
  },
};

const DEFAULT_DOMAIN_CONFIG = {
  icon: Code,
  color: "#8B5CF6",
  bgLight: "rgba(139, 92, 246, 0.1)",
  bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.08) 100%)",
};

function getDomainConfig(domain?: string) {
  if (!domain) return DEFAULT_DOMAIN_CONFIG;
  return IT_DOMAIN_CONFIG[domain] || DEFAULT_DOMAIN_CONFIG;
}

function buildCourseUrl(course: { title: string; provider: string; url?: string }): string {
  const query = encodeURIComponent(`${course.title} ${course.provider}`);
  const provider = course.provider.toLowerCase();
  const title = course.title.toLowerCase();

  if (provider.includes("iti") || provider.includes("dgt") || title.includes("iti")) {
    return `https://iti.dgt.gov.in/`;
  }
  if (provider.includes("skill india") || provider.includes("nsdc") || provider.includes("pmkvy")) {
    return `https://www.skillindia.gov.in/search?search=${query}`;
  }
  if (provider.includes("nptel")) return `https://nptel.ac.in/courses?search=${query}`;
  if (provider.includes("swayam")) return `https://swayam.gov.in/search?searchText=${query}`;
  if (provider.includes("coursera")) return `https://www.coursera.org/search?query=${query}`;
  if (provider.includes("edx")) return `https://www.edx.org/search?q=${query}`;
  if (provider.includes("udemy")) return `https://www.udemy.com/courses/search/?src=ukw&q=${query}`;
  if (provider.includes("upgrad")) return `https://www.upgrad.com/search/?q=${query}`;
  if (provider.includes("simplilearn")) return `https://www.simplilearn.com/search?q=${query}`;
  if (provider.includes("great learning")) return `https://www.mygreatlearning.com/search?query=${query}`;
  if (provider.includes("internshala")) return `https://trainings.internshala.com/search/?search_term=${query}`;
  if (provider.includes("linkedin")) return `https://www.linkedin.com/learning/search?keywords=${query}`;
  return `https://www.google.com/search?q=${encodeURIComponent(`${course.title} ${course.provider} online course India`)}`;
}

function buildJobUrl(job: { title: string; company: string; url?: string }): string {
  const query = encodeURIComponent(`${job.title} ${job.company}`);
  return `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India`;
}

interface ResultsPageProps {
  answers: number[];
  questions: Question[];
  additionalInfo?: string;
  onBack: () => void;
  onHome?: () => void;
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onDashboard?: () => void;
  onViewLocalEcosystem?: () => void;
  onAddLocation?: () => void;
  onShowOpportunities?: () => void;
  onLoginRequired?: () => void;
  hasLocation?: boolean;
  userState?: string;
  userDistrict?: string;
  onLocationChange?: (state: string, city: string) => void;
}

// Modern card skeleton with subtle animation
const CardSkeleton = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse">
    <div className="h-5 w-3/4 bg-white/[0.08] rounded-lg" />
    <div className="h-3 w-1/3 bg-white/[0.05] rounded-lg mt-3" />
    <div className="h-3 w-full bg-white/[0.05] rounded-lg mt-4" />
    <div className="h-3 w-5/6 bg-white/[0.05] rounded-lg mt-2" />
  </div>
);

// Shell component for consistent layout
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
    <div className="min-h-screen bg-[#09090B] text-white">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t("common.goBack")}</span>
        </button>
        {children}
      </main>
    </div>
  );
}

export function ResultsPage({
  answers,
  questions,
  additionalInfo,
  onBack,
  onHome,
  user,
  onSignOut,
  onDashboard,
  onShowOpportunities,
  onLoginRequired,
  hasLocation,
  userState,
  userDistrict,
  onLocationChange,
}: ResultsPageProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";
  const [showLocationModal, setShowLocationModal] = useState(false);

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
  const [localJobs, setLocalJobs] = useState<JobByDistance[] | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [jobsLocation, setJobsLocation] = useState<string | null>(null);

  // Fetch career recommendation
  useEffect(() => {
    if (answers.length === 0 || questions.length === 0) return;
    let cancelled = false;

    const run = async () => {
      const cached = getCareerCache(language);
      if (cached) {
        setCareer(cached);
        setCareerLoading(false);
        return;
      }

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
              itDomain: progress.career_it_domain || undefined,
            };
            if (!cancelled) {
              setCareer(fromDb);
              sessionStorage.setItem(`sm_career_${language}`, JSON.stringify(fromDb));
              sessionStorage.setItem("sm_career_score", JSON.stringify(fromDb.matchScore));
              setLockedScore(fromDb.matchScore);
              setCareerLoading(false);
              return;
            }
          }
        } catch { /* fall through */ }
      }

      try {
        setCareerLoading(true);
        setCareerError(null);
        const recommendation = await analyzeAnswers({ answers, questions, additionalInfo, language });
        if (cancelled) return;
        const score = lockedScore ?? recommendation.matchScore;
        if (!lockedScore) {
          sessionStorage.setItem("sm_career_score", JSON.stringify(score));
          setLockedScore(score);
        }
        const stabilized = { ...recommendation, matchScore: score };
        setCareer(stabilized);
        sessionStorage.setItem(`sm_career_${language}`, JSON.stringify(stabilized));
        if (user?.id) saveCareerResult(user.id, stabilized);
      } catch (err) {
        if (cancelled) return;
        setCareerError(err instanceof Error ? err.message : t("results.failedToLoad"));
      } finally {
        if (!cancelled) setCareerLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questions, additionalInfo, language]);

  // Fetch courses and jobs
  useEffect(() => {
    if (!career) return;
    let cancelled = false;
    const careerContext = { title: career.title, description: career.description, skills: career.skills };

    const loadCourses = async () => {
      try {
        const cached = sessionStorage.getItem(`sm_courses_${language}`);
        if (cached) { setCourses(JSON.parse(cached)); return; }
      } catch { /* ignore */ }

      if (user?.id) {
        try {
          const progress = await fetchUserProgress(user.id);
          if (progress?.recommended_courses?.length && !cancelled) {
            setCourses(progress.recommended_courses);
            sessionStorage.setItem(`sm_courses_${language}`, JSON.stringify(progress.recommended_courses));
            return;
          }
        } catch { /* fall through */ }
      }

      try {
        setCoursesLoading(true);
        setCoursesError(null);
        const result = await fetchCourseRecommendations({ language, career: careerContext });
        if (cancelled) return;
        setCourses(result);
        sessionStorage.setItem(`sm_courses_${language}`, JSON.stringify(result));
        if (user?.id) saveRecommendedCourses(user.id, result);
      } catch (err) {
        if (!cancelled) setCoursesError(err instanceof Error ? err.message : t("results.coursesError"));
      } finally {
        if (!cancelled) setCoursesLoading(false);
      }
    };

    const loadJobs = async () => {
      setJobsLoading(true);
      setJobsError(null);

      // Always fetch generic jobs (All India)
      const loadGenericJobs = async () => {
        try {
          const cached = sessionStorage.getItem(`sm_jobs_${language}`);
          if (cached) { 
            const parsed = JSON.parse(cached);
            // Only use cache if it has actual jobs
            if (parsed && parsed.length > 0) {
              setJobs(parsed); 
              return; 
            }
          }
        } catch { /* ignore */ }

        if (user?.id) {
          try {
            const progress = await fetchUserProgress(user.id);
            if (progress?.recommended_jobs?.length && !cancelled) {
              setJobs(progress.recommended_jobs);
              sessionStorage.setItem(`sm_jobs_${language}`, JSON.stringify(progress.recommended_jobs));
              return;
            }
          } catch { /* fall through */ }
        }

        try {
          const result = await fetchJobRecommendations({ language, career: careerContext });
          if (cancelled) return;
          setJobs(result);
          sessionStorage.setItem(`sm_jobs_${language}`, JSON.stringify(result));
          if (user?.id) saveRecommendedJobs(user.id, result);
        } catch (err) {
          if (!cancelled) console.error("Failed to load generic jobs:", err);
        }
      };

      // Fetch location-based jobs if user has location
      const loadLocalJobs = async () => {
        if (!userState || !userDistrict) return;
        
        try {
          const cacheKey = `sm_local_jobs_${userState}_${userDistrict}_${language}`;
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            setLocalJobs(parsed.jobs);
            setJobsLocation(parsed.userLocation);
            return;
          }
        } catch { /* ignore */ }

        try {
          const result = await fetchJobsByDistance({
            state: userState,
            district: userDistrict,
            career: { title: career.title },
            language,
          });
          if (cancelled) return;
          setLocalJobs(result.jobs);
          setJobsLocation(result.userLocation);
          const cacheKey = `sm_local_jobs_${userState}_${userDistrict}_${language}`;
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        } catch (err) {
          if (!cancelled) console.error("Failed to load local jobs:", err);
        }
      };

      // Fetch both in parallel
      try {
        await Promise.all([loadGenericJobs(), loadLocalJobs()]);
      } catch (err) {
        if (!cancelled) setJobsError(err instanceof Error ? err.message : t("results.jobsError"));
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    };

    loadCourses();
    loadJobs();
    return () => { cancelled = true; };
  }, [career, language, t, user?.id, userState, userDistrict]);

  const brand = t("common.brand");

  // Loading state
  if (careerLoading) {
    return (
      <ResultsShell brand={brand} onBack={onBack} user={user} onSignOut={onSignOut} onHome={onHome} onDashboard={onDashboard} onShowOpportunities={onShowOpportunities} onLoginRequired={onLoginRequired}>
        <ResultsPageSkeleton />
      </ResultsShell>
    );
  }

  // Error state
  if (careerError || !career) {
    return (
      <ResultsShell brand={brand} onBack={onBack} onHome={onHome}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/[0.06] p-10 max-w-md">
            <p className="text-lg mb-4 text-red-400 font-medium">
              {t("common.errorPrefix")}: {careerError || t("results.failedToLoad")}
            </p>
            <Button onClick={onBack} className="bg-white text-zinc-900 hover:bg-zinc-100">
              {t("common.goBackButton")}
            </Button>
          </div>
        </div>
      </ResultsShell>
    );
  }

  const domainConfig = getDomainConfig(career.itDomain);
  const DomainIcon = domainConfig.icon;

  return (
    <ResultsShell brand={brand} onBack={onBack} user={user} onSignOut={onSignOut} onHome={onHome} onDashboard={onDashboard} onShowOpportunities={onShowOpportunities} onLoginRequired={onLoginRequired}>
      <div className="space-y-8">
        
        {/* Hero Section - Career Match Card */}
        <section className="relative">
          {/* Subtle gradient background glow */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-40 blur-3xl -z-10"
            style={{ background: domainConfig.bgGradient }}
          />
          
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            {/* Domain Badge */}
            {career.itDomain && (
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: domainConfig.bgLight }}
                  >
                    <DomainIcon className="w-5 h-5" style={{ color: domainConfig.color }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                      {t("results.itDomainLabel", { defaultValue: "IT Domain" })}
                    </p>
                    <p className="text-base font-semibold text-white">{career.itDomain}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Content */}
            <div className="p-6 md:p-8">
              {/* Career Title & Match Score */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: domainConfig.color }} />
                    {t("results.idealCareer")}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {career.title}
                  </h1>
                </div>
                
                {/* Match Score - Circular */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={domainConfig.color}
                        strokeWidth="2.5"
                        strokeDasharray={`${career.matchScore}, 100`}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                        style={{ filter: `drop-shadow(0 0 6px ${domainConfig.color}60)` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{career.matchScore}%</span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Your</p>
                    <p className="text-sm text-zinc-300 font-medium">Career Match</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">{t("results.aboutRole")}</h3>
                <p className="text-[15px] text-zinc-300 leading-relaxed">{career.description}</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-zinc-500" />
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t("results.salaryRange")}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-white">{career.salary}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-zinc-500" />
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t("results.jobGrowth")}
                    </p>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{career.growth}</p>
                </div>
              </div>
              
              {/* Skills */}
              <div>
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 text-center">
                  {t("results.keySkills")}
                </h3>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {career.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-white/[0.06] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.1] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">{t("results.coursesTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursesLoading ? (
              <>
                <div className="col-span-full flex items-center gap-3 text-zinc-500 mb-2">
                  <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <span className="text-sm">Loading courses...</span>
                </div>
                <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
              </>
            ) : coursesError || !courses?.length ? (
              <div className="col-span-full">
                <ResultsSectionEmptyState
                  kind="courses"
                  title={coursesError ? t("results.coursesUnavailableTitle") : t("results.noCoursesTitle")}
                  description={coursesError ? t("results.coursesUnavailableDescription") : t("results.noCoursesDescription")}
                />
              </div>
            ) : (
              courses.map((course, index) => (
                <a
                  key={`${course.title}-${index}`}
                  href={buildCourseUrl(course)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => user?.id && logCourseClick(user.id, { title: course.title, provider: course.provider, url: buildCourseUrl(course) })}
                  className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/[0.06]"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        {course.title}
                      </p>
                      <p className="text-sm text-purple-400/80 mt-1.5 font-medium">{course.provider}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-zinc-600 group-hover:text-purple-400 transition-colors mt-0.5" />
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{course.reason}</p>
                </a>
              ))
            )}
          </div>
        </section>

        {/* Jobs Near You Section - Only when location is set */}
        {jobsLocation && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {t("results.jobsNearYou", { defaultValue: "Jobs Near You" })}
                  </h2>
                  <p className="text-sm text-zinc-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {jobsLocation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                {t("location.changeLocation", { defaultValue: "Change" })}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobsLoading ? (
                <>
                  <div className="col-span-full flex items-center gap-3 text-zinc-500 mb-2">
                    <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <span className="text-sm">Finding jobs near you...</span>
                  </div>
                  <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
                </>
              ) : !localJobs?.length ? (
                <div className="col-span-full">
                  <ResultsSectionEmptyState
                    kind="jobs"
                    title={t("results.noLocalJobsTitle", { defaultValue: "No nearby jobs found" })}
                    description={t("results.noLocalJobsDescription", { defaultValue: "We couldn't find jobs in your area. Check out jobs across India below." })}
                  />
                </div>
              ) : (
                localJobs.map((job, index) => (
                  <a
                    key={`local-${job.title}-${job.company}-${index}`}
                    href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company}`)}&location=India`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => user?.id && logJobClick(user.id, { title: job.title, company: job.company, url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company}`)}&location=India` })}
                    className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors leading-snug">
                          {job.title}
                        </p>
                        <p className="text-sm text-purple-400/80 mt-1 font-medium">{job.company}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 shrink-0 text-zinc-600 group-hover:text-purple-400 transition-colors mt-0.5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.city}</span>
                      {job.distanceKm !== null && (
                        <span className="text-purple-400/70 ml-1">({job.distanceKm} km away)</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{job.reason}</p>
                  </a>
                ))
              )}
            </div>
          </section>
        )}

        {/* Jobs Across India Section - Always shown */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {jobsLocation 
                  ? t("results.jobsAcrossIndia", { defaultValue: "Jobs Across India" })
                  : t("results.jobsTitle")
                }
              </h2>
              {!jobsLocation && (
                <p className="text-sm text-zinc-500 mt-0.5">
                  {t("results.jobsSubtitle", { defaultValue: "Opportunities matching your career profile" })}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobsLoading ? (
              <>
                <div className="col-span-full flex items-center gap-3 text-zinc-500 mb-2">
                  <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <span className="text-sm">Loading jobs...</span>
                </div>
                <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
              </>
            ) : jobsError || !jobs?.length ? (
              <div className="col-span-full">
                <ResultsSectionEmptyState
                  kind="jobs"
                  title={jobsError ? t("results.jobsUnavailableTitle") : t("results.noJobsTitle")}
                  description={jobsError ? t("results.jobsUnavailableDescription") : t("results.noJobsDescription")}
                />
              </div>
            ) : (
              jobs.map((job, index) => (
                <a
                  key={`india-${job.title}-${job.company}-${index}`}
                  href={buildJobUrl(job)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => user?.id && logJobClick(user.id, { title: job.title, company: job.company, url: buildJobUrl(job) })}
                  className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/[0.06]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        {job.title}
                      </p>
                      <p className="text-sm text-purple-400/80 mt-1 font-medium">{job.company}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-zinc-600 group-hover:text-purple-400 transition-colors mt-0.5" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{job.reason}</p>
                </a>
              ))
            )}
          </div>
        </section>

        {/* Local Opportunities - Only show if NO location set */}
        {!hasLocation && (
          <section className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.01] p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-zinc-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{t("location.localOpportunities", { defaultValue: "Local Opportunities" })}</h3>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {t("location.addPrompt", { defaultValue: "Add your location to see jobs near you" })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowLocationModal(true)} 
                className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white text-sm font-medium transition-colors w-full sm:w-auto"
              >
                {t("location.addLocation", { defaultValue: "Add Location" })}
              </button>
            </div>
          </section>
        )}

        {/* Location Modal */}
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onSave={(state, city) => {
            onLocationChange?.(state, city);
            // Clear local jobs cache to trigger refetch
            sessionStorage.removeItem(`sm_local_jobs_${state}_${city}_${language}`);
          }}
          initialState={userState}
          initialCity={userDistrict}
        />

      </div>
    </ResultsShell>
  );
}
