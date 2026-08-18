import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, BookOpen, Briefcase, RefreshCw, CheckCircle2, Circle, MapPin, ArrowLeft } from "lucide-react";
import type { AuthUser } from "../lib/auth";
import { PageHeader } from "./layout/PageHeader";
import { Button } from "./ui/button";
import {
  fetchUserProgress,
  logCourseClick,
  logJobClick,
  markCourseComplete,
  unmarkCourseComplete,
  type UserProgress,
} from "../lib/dashboard";

interface DashboardPageProps {
  user: AuthUser | null;
  onBack: () => void;
  onSignOut?: () => void;
  onHome?: () => void;
  onRetakeQuiz: () => void;
  onShowOpportunities?: () => void;
  onGoToCourses?: () => void;
  onChangeLocation?: () => void;
}

export function DashboardPage({
  user,
  onBack,
  onSignOut,
  onHome,
  onRetakeQuiz,
  onShowOpportunities,
  onGoToCourses,
  onChangeLocation,
}: DashboardPageProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchUserProgress(user.id).then((data) => {
      setProgress(data);
      setLoading(false);
    });
  }, [user]);

  const refresh = () => {
    if (user?.id) fetchUserProgress(user.id).then(setProgress);
  };

  const brand = t("common.brand");

  const completedCourses = progress?.courses_completed ?? [];
  const clickedCourses = progress?.courses_clicked ?? [];
  const inProgressCourses = clickedCourses.filter(
    (c) => !completedCourses.some((done) => done.title === c.title)
  );
  const notStartedCourses = (progress?.recommended_courses ?? []).filter(
    (course) =>
      !clickedCourses.some((c) => c.title === course.title) &&
      !completedCourses.some((c) => c.title === course.title)
  );

  const exploredJobs = progress?.jobs_clicked ?? [];
  const notExploredJobs = (progress?.recommended_jobs ?? []).filter(
    (job) => !exploredJobs.some((j) => j.title === job.title)
  );

  const handleMarkComplete = (course: { title: string; provider?: string; url?: string }) => {
    if (!user?.id) return;
    markCourseComplete(user.id, {
      title: course.title,
      provider: course.provider,
      url: course.url || "",
    }).then(refresh);
  };

  const handleUnmarkComplete = (title: string) => {
    if (!user?.id) return;
    unmarkCourseComplete(user.id, title).then(refresh);
  };

  const handleStartCourse = (course: { title: string; provider?: string; url?: string }) => {
    if (!user?.id) return;
    logCourseClick(user.id, {
      title: course.title,
      provider: course.provider,
      url: course.url || "",
    }).then(refresh);
  };

  const handleExploreJob = (job: { title: string; company?: string; url?: string }) => {
    if (!user?.id) return;
    logJobClick(user.id, {
      title: job.title,
      company: job.company,
      url: job.url || "",
    }).then(refresh);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />
      <div className="relative z-10">
        <PageHeader
          brand={brand}
          user={user}
          onSignOut={onSignOut}
          onHome={onHome}
          onShowOpportunities={onShowOpportunities}
          onDashboard={undefined}
          sticky
        />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Back link */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.goBack", { defaultValue: "Go back" })}
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-purple-900/40 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : !progress || !progress.career_title ? (
            <div className="text-center bg-[#111111] rounded-2xl border border-purple-900/40 p-8 sm:p-10">
              <p className="text-base text-gray-300 mb-6">
                {t("dashboard.noResultsYet", {
                  defaultValue: "You haven't completed a career assessment yet.",
                })}
              </p>
              <Button
                onClick={onRetakeQuiz}
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold"
              >
                {t("dashboard.startQuiz", { defaultValue: "Start Your Assessment" })}
              </Button>
            </div>
          ) : (
            <>
              {/* Career Match Card */}
              <div className="bg-[#111111] rounded-2xl overflow-hidden border border-purple-900/40">
                <div className="bg-gradient-to-r from-purple-800 to-purple-950 px-5 sm:px-6 py-5 sm:py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-purple-200 uppercase tracking-wide mb-1">
                        {t("dashboard.currentMatch", { defaultValue: "Your Career Match" })}
                      </p>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">{progress.career_title}</h1>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-3xl sm:text-4xl font-bold text-white">
                        {progress.career_match_score}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {progress.career_description}
                  </p>
                  
                  {/* Salary & Growth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#0a0a0a] border border-purple-900/30 p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                        {t("results.salaryRange", { defaultValue: "Salary Range" })}
                      </p>
                      <p className="text-base font-semibold text-white">{progress.career_salary}</p>
                    </div>
                    <div className="rounded-xl bg-[#0a0a0a] border border-purple-900/30 p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                        {t("results.jobGrowth", { defaultValue: "Job Growth" })}
                      </p>
                      <p className="text-sm font-semibold text-white">{progress.career_growth}</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      onClick={onRetakeQuiz}
                      variant="outline"
                      size="sm"
                      className="border-purple-900/50 bg-transparent text-gray-300 hover:bg-purple-950/50 hover:text-white"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t("dashboard.retakeQuiz", { defaultValue: "Retake Assessment" })}
                    </Button>
                    {onChangeLocation && (
                      <Button
                        onClick={onChangeLocation}
                        variant="outline"
                        size="sm"
                        className="border-purple-900/50 bg-transparent text-gray-300 hover:bg-purple-950/50 hover:text-white"
                      >
                        <MapPin className="w-4 h-4" />
                        {t("dashboard.changeLocation", { defaultValue: "Change Location" })}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#111111] rounded-xl p-4 border border-purple-900/40 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{completedCourses.length}</p>
                  <p className="text-xs text-gray-400">{t("dashboard.coursesFinished", { defaultValue: "Finished" })}</p>
                </div>
                <div className="bg-[#111111] rounded-xl p-4 border border-purple-900/40 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-purple-900/30 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-300" />
                  </div>
                  <p className="text-2xl font-bold text-white">{inProgressCourses.length}</p>
                  <p className="text-xs text-gray-400">{t("dashboard.coursesInProgress", { defaultValue: "In Progress" })}</p>
                </div>
                <div className="bg-[#111111] rounded-xl p-4 border border-purple-900/40 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-300" />
                  </div>
                  <p className="text-2xl font-bold text-white">{exploredJobs.length}</p>
                  <p className="text-xs text-gray-400">{t("dashboard.jobsSaved", { defaultValue: "Jobs Explored" })}</p>
                </div>
              </div>

              {/* Recommended Courses */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    {t("dashboard.recommendedCourses", { defaultValue: "Recommended Courses" })}
                  </h2>
                  {onGoToCourses && (
                    <Button
                      onClick={onGoToCourses}
                      size="sm"
                      className="bg-purple-700 hover:bg-purple-600 text-white font-semibold"
                    >
                      {t("dashboard.goToCourses", { defaultValue: "Browse All Courses" })}
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {completedCourses.length === 0 && inProgressCourses.length === 0 && notStartedCourses.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-full">
                      {t("dashboard.noRecommendedCourses", { defaultValue: "No course recommendations yet." })}
                    </p>
                  ) : (
                    <>
                      {completedCourses.map((course, i) => (
                        <div key={`done-${i}`} className="flex items-center gap-3 p-4 rounded-xl bg-green-950/20 border border-green-900/40">
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <a href={course.url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-green-300 text-sm flex items-center gap-2">
                              <span className="truncate">{course.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
                            </a>
                            {course.provider && <p className="text-xs text-gray-500 truncate">{course.provider}</p>}
                          </div>
                          <button type="button" onClick={() => handleUnmarkComplete(course.title)} className="text-xs text-gray-500 hover:text-gray-300 shrink-0">Undo</button>
                        </div>
                      ))}
                      
                      {inProgressCourses.map((course, i) => (
                        <div key={`prog-${i}`} className="flex items-center gap-3 p-4 rounded-xl bg-[#111111] border border-purple-900/40">
                          <div className="w-5 h-5 rounded-full border-2 border-purple-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <a href={course.url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-purple-300 text-sm flex items-center gap-2">
                              <span className="truncate">{course.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
                            </a>
                            {course.provider && <p className="text-xs text-gray-500 truncate">{course.provider}</p>}
                          </div>
                          <button type="button" onClick={() => handleMarkComplete(course)} className="text-xs text-purple-400 hover:text-purple-300 shrink-0">Mark done</button>
                        </div>
                      ))}
                      
                      {notStartedCourses.map((course, i) => (
                        <div key={`new-${i}`} className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-purple-900/30">
                          <Circle className="w-5 h-5 text-gray-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <a href={course.url} target="_blank" rel="noopener noreferrer" onClick={() => handleStartCourse(course)} className="font-medium text-gray-300 hover:text-white text-sm flex items-center gap-2">
                              <span className="truncate">{course.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
                            </a>
                            {course.provider && <p className="text-xs text-gray-500 truncate">{course.provider}</p>}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </section>

              {/* Job Opportunities */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-white">
                  {t("dashboard.bestJobOpportunities", { defaultValue: "Job Opportunities for This Career" })}
                </h2>
                
                {exploredJobs.length === 0 && notExploredJobs.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("dashboard.noRecommendedJobs", { defaultValue: "No job recommendations yet." })}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      ...exploredJobs.map((j) => ({ ...j, explored: true })),
                      ...notExploredJobs.map((j) => ({ ...j, explored: false })),
                    ]
                      .slice(0, 6)
                      .map((job, i) => (
                        <a
                          key={i}
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => !job.explored && handleExploreJob(job)}
                          className={`group rounded-xl border p-4 transition-colors ${
                            job.explored
                              ? "border-purple-500/50 bg-purple-950/20"
                              : "border-purple-900/40 bg-[#111111] hover:border-purple-500/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-white group-hover:text-purple-300 text-sm truncate">
                                {job.title}
                              </p>
                              {job.company && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{job.company}</p>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-300 shrink-0" />
                          </div>
                        </a>
                      ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
