import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, BookOpen, Briefcase, RefreshCw, CheckCircle2, Circle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
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
  user: User | null;
  onBack: () => void;
  onSignOut?: () => void;
  onHome?: () => void;
  onRetakeQuiz: () => void;
  onShowOpportunities?: () => void;
}

export function DashboardPage({
  user,
  onBack,
  onSignOut,
  onHome,
  onRetakeQuiz,
  onShowOpportunities,
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
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />
      <div className="relative z-10">
        <PageHeader
          brand={brand}
          onBack={onBack}
          backLabel={t("common.goBack", { defaultValue: "Go back" })}
          title={t("dashboard.title", { defaultValue: "My Dashboard" })}
          user={user}
          onSignOut={onSignOut}
          onHome={onHome}
          onShowOpportunities={onShowOpportunities}
          sticky
        />

        <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-16 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-purple-900/40 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : !progress || !progress.career_title ? (
            <div className="text-center bg-[#111111] rounded-xl border border-purple-900/40 p-10 shadow-sm">
              <p className="text-lg text-gray-300 mb-6">
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
              <div className="bg-[#111111] rounded-xl overflow-hidden shadow-lg border border-purple-900/40">
                <div className="bg-gradient-to-r from-purple-800 to-purple-950 px-6 md:px-10 py-8 text-white">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-body-sm font-semibold opacity-90 mb-2 uppercase tracking-wide">
                        {t("dashboard.currentMatch", { defaultValue: "Your Current Career Match" })}
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold">{progress.career_title}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-bold">
                        {progress.career_match_score}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-6 space-y-4">
                  <p className="text-body-sm text-gray-300 leading-relaxed">
                    {progress.career_description}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-purple-900/40 bg-[#1a1a1a] p-4">
                      <p className="text-body-xs font-semibold text-gray-400 uppercase mb-1">
                        {t("results.salaryRange", { defaultValue: "Salary Range" })}
                      </p>
                      <p className="font-bold text-white">{progress.career_salary}</p>
                    </div>
                    <div className="rounded-lg border border-purple-900/40 bg-[#1a1a1a] p-4">
                      <p className="text-body-xs font-semibold text-gray-400 uppercase mb-1">
                        {t("results.jobGrowth", { defaultValue: "Job Growth" })}
                      </p>
                      <p className="font-bold text-white">{progress.career_growth}</p>
                    </div>
                  </div>
                  <Button
                    onClick={onRetakeQuiz}
                    variant="outline"
                    className="border-purple-900/50 bg-[#0b0b0b] text-white hover:bg-purple-950/50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t("dashboard.retakeQuiz", { defaultValue: "Retake Assessment" })}
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-[#111111] rounded-xl p-5 border border-purple-900/40 flex items-center gap-4">
                  <div className="p-3 bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{completedCourses.length}</p>
                    <p className="text-body-sm text-gray-400">
                      {t("dashboard.coursesFinished", { defaultValue: "Courses Finished" })}
                    </p>
                  </div>
                </div>
                <div className="bg-[#111111] rounded-xl p-5 border border-purple-900/40 flex items-center gap-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{inProgressCourses.length}</p>
                    <p className="text-body-sm text-gray-400">
                      {t("dashboard.coursesInProgress", { defaultValue: "In Progress" })}
                    </p>
                  </div>
                </div>
                <div className="bg-[#111111] rounded-xl p-5 border border-purple-900/40 flex items-center gap-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <Briefcase className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{exploredJobs.length}</p>
                    <p className="text-body-sm text-gray-400">
                      {t("dashboard.jobsSaved", { defaultValue: "Jobs Explored" })}
                    </p>
                  </div>
                </div>
              </div>

              <section className="space-y-4">
                <h3 className="text-h4 font-bold text-white">
                  {t("dashboard.yourCoursesSection", { defaultValue: "Your Courses" })}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <h4 className="text-sm font-bold text-green-400 uppercase tracking-wide">
                        {t("dashboard.finished", { defaultValue: "Finished" })}
                      </h4>
                    </div>
                    {completedCourses.length === 0 ? (
                      <p className="text-body-xs text-gray-500">
                        {t("dashboard.noFinished", { defaultValue: "Nothing finished yet." })}
                      </p>
                    ) : (
                      completedCourses.map((course, i) => (
                        <div key={i} className="rounded-lg border border-green-900/40 bg-green-950/20 p-3">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white hover:text-green-300 text-sm flex items-center justify-between gap-2"
                          >
                            {course.title}
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                          {course.provider && (
                            <p className="text-body-xs text-gray-400 mt-0.5">{course.provider}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => handleUnmarkComplete(course.title)}
                            className="text-body-xs text-gray-500 hover:text-gray-300 mt-2 underline"
                          >
                            {t("dashboard.undoComplete", { defaultValue: "Undo" })}
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-300" />
                      <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                        {t("dashboard.inProgress", { defaultValue: "In Progress" })}
                      </h4>
                    </div>
                    {inProgressCourses.length === 0 ? (
                      <p className="text-body-xs text-gray-500">
                        {t("dashboard.noInProgress", { defaultValue: "Nothing in progress." })}
                      </p>
                    ) : (
                      inProgressCourses.map((course, i) => (
                        <div key={i} className="rounded-lg border border-purple-900/40 bg-[#111111] p-3">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white hover:text-purple-300 text-sm flex items-center justify-between gap-2"
                          >
                            {course.title}
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                          {course.provider && (
                            <p className="text-body-xs text-gray-400 mt-0.5">{course.provider}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => handleMarkComplete(course)}
                            className="flex items-center gap-1 text-body-xs text-purple-300 hover:text-purple-200 mt-2"
                          >
                            <Circle className="w-3 h-3" />
                            {t("dashboard.markComplete", { defaultValue: "Mark as Complete" })}
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-gray-500" />
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                        {t("dashboard.notStarted", { defaultValue: "Not Started" })}
                      </h4>
                    </div>
                    {notStartedCourses.length === 0 ? (
                      <p className="text-body-xs text-gray-500">
                        {t("dashboard.noRecommendedCourses", { defaultValue: "No course recommendations yet." })}
                      </p>
                    ) : (
                      notStartedCourses.map((course, i) => (
                        <div key={i} className="rounded-lg border border-purple-900/40 bg-[#0b0b0b] p-3">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleStartCourse(course)}
                            className="font-semibold text-gray-300 hover:text-white text-sm flex items-center justify-between gap-2"
                          >
                            {course.title}
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                          <p className="text-body-xs text-gray-500 mt-0.5">{course.provider}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-h4 font-bold text-white">
                  {t("dashboard.bestJobOpportunities", { defaultValue: "Best Job Opportunities for This Career" })}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            ? "border-purple-500 bg-purple-950/20"
                            : "border-purple-900/40 bg-[#111111] hover:border-purple-500"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white group-hover:text-purple-300 text-sm">
                            {job.title}
                          </p>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-300 shrink-0" />
                        </div>
                        {job.company && (
                          <p className="text-body-xs text-gray-400 mt-1">{job.company}</p>
                        )}
                        {job.explored && (
                          <span className="text-body-xs text-purple-300 mt-2 inline-block">
                            {t("dashboard.explored", { defaultValue: "Explored" })}
                          </span>
                        )}
                      </a>
                    ))}
                </div>
                {exploredJobs.length === 0 && notExploredJobs.length === 0 && (
                  <p className="text-body-sm text-gray-400">
                    {t("dashboard.noRecommendedJobs", { defaultValue: "No job recommendations yet." })}
                  </p>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
