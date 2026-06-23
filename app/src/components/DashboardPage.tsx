import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, BookOpen, Briefcase, RefreshCw } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { PageHeader } from "./layout/PageHeader";
import { Button } from "./ui/button";
import { fetchUserProgress, logCourseClick, logJobClick, type UserProgress } from "../lib/dashboard";

interface DashboardPageProps {
  user: User | null;
  onBack: () => void;
  onSignOut?: () => void;
  onHome?: () => void;
  onRetakeQuiz: () => void;
}

export function DashboardPage({ user, onBack, onSignOut, onHome, onRetakeQuiz }: DashboardPageProps) {
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

  const brand = t("common.brand");

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
          sticky
        />

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-16 space-y-8">
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#111111] rounded-xl p-5 border border-purple-900/40 flex items-center gap-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {progress.courses_clicked.length}
                    </p>
                    <p className="text-body-sm text-gray-400">
                      {t("dashboard.coursesStarted", { defaultValue: "Courses Started" })}
                    </p>
                  </div>
                </div>
                <div className="bg-[#111111] rounded-xl p-5 border border-purple-900/40 flex items-center gap-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <Briefcase className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {progress.jobs_clicked.length}
                    </p>
                    <p className="text-body-sm text-gray-400">
                      {t("dashboard.jobsSaved", { defaultValue: "Jobs Explored" })}
                    </p>
                  </div>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-h4 font-bold text-white">
                  {t("dashboard.recommendedCourses", { defaultValue: "Recommended Courses" })}
                </h3>
                {progress.recommended_courses.length === 0 ? (
                  <p className="text-body-sm text-gray-400">
                    {t("dashboard.noRecommendedCourses", {
                      defaultValue: "No course recommendations yet.",
                    })}
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {progress.recommended_courses.map((course, i) => {
                      const started = progress.courses_clicked.some(
                        (c) => c.title === course.title
                      );
                      return (
                        <a
                          key={i}
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (user?.id) {
                              logCourseClick(user.id, {
                                title: course.title,
                                provider: course.provider,
                                url: course.url || "",
                              }).then(() => {
                                fetchUserProgress(user.id).then(setProgress);
                              });
                            }
                          }}
                          className="group flex items-center justify-between rounded-lg border border-purple-900/40 bg-[#111111] p-4 hover:border-purple-500 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-white group-hover:text-purple-300">
                              {course.title}
                            </p>
                            <p className="text-body-xs text-gray-400">{course.provider}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {started && (
                              <span className="text-xs font-semibold text-purple-300 bg-purple-900/40 px-2 py-1 rounded-full">
                                {t("dashboard.started", { defaultValue: "Started" })}
                              </span>
                            )}
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-300" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-h4 font-bold text-white">
                  {t("dashboard.recommendedJobs", { defaultValue: "Recommended Jobs" })}
                </h3>
                {progress.recommended_jobs.length === 0 ? (
                  <p className="text-body-sm text-gray-400">
                    {t("dashboard.noRecommendedJobs", {
                      defaultValue: "No job recommendations yet.",
                    })}
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {progress.recommended_jobs.map((job, i) => {
                      const explored = progress.jobs_clicked.some(
                        (j) => j.title === job.title
                      );
                      return (
                        <a
                          key={i}
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (user?.id) {
                              logJobClick(user.id, {
                                title: job.title,
                                company: job.company,
                                url: job.url || "",
                              }).then(() => {
                                fetchUserProgress(user.id).then(setProgress);
                              });
                            }
                          }}
                          className="group flex items-center justify-between rounded-lg border border-purple-900/40 bg-[#111111] p-4 hover:border-purple-500 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-white group-hover:text-purple-300">
                              {job.title}
                            </p>
                            <p className="text-body-xs text-gray-400">{job.company}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {explored && (
                              <span className="text-xs font-semibold text-purple-300 bg-purple-900/40 px-2 py-1 rounded-full">
                                {t("dashboard.explored", { defaultValue: "Explored" })}
                              </span>
                            )}
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-300" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-h4 font-bold text-white">
                  {t("dashboard.yourCourses", { defaultValue: "Courses You've Started" })}
                </h3>
                {progress.courses_clicked.length === 0 ? (
                  <p className="text-body-sm text-gray-400">
                    {t("dashboard.noCourses", {
                      defaultValue: "You haven't started any courses yet. Visit your results to explore options.",
                    })}
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {progress.courses_clicked.map((course, i) => (
                      <a
                        key={i}
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-lg border border-purple-900/40 bg-[#111111] p-4 hover:border-purple-500 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-white group-hover:text-purple-300">
                            {course.title}
                          </p>
                          {course.provider && (
                            <p className="text-body-xs text-gray-400">{course.provider}</p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-300 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-h4 font-bold text-white">
                  {t("dashboard.yourJobs", { defaultValue: "Jobs You've Explored" })}
                </h3>
                {progress.jobs_clicked.length === 0 ? (
                  <p className="text-body-sm text-gray-400">
                    {t("dashboard.noJobs", {
                      defaultValue: "You haven't explored any job listings yet.",
                    })}
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {progress.jobs_clicked.map((job, i) => (
                      <a
                        key={i}
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-lg border border-purple-900/40 bg-[#111111] p-4 hover:border-purple-500 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-white group-hover:text-purple-300">
                            {job.title}
                          </p>
                          {job.company && (
                            <p className="text-body-xs text-gray-400">{job.company}</p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-300 shrink-0" />
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
