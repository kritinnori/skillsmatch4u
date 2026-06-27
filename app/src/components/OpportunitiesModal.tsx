import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, MapPin, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import {
  fetchJobsByDistance,
  fetchLocalIndustries,
  type JobByDistance,
  type LocalIndustry,
} from "../lib/api";

interface OpportunitiesModalProps {
  state: string;
  district: string;
  careerTitle?: string;
  onClose: () => void;
}

type ModalView = "choice" | "jobsByDistance" | "trendingIndustries";

export function OpportunitiesModal({
  state,
  district,
  careerTitle,
  onClose,
}: OpportunitiesModalProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";
  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  const [view, setView] = useState<ModalView>("choice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobByDistance[]>([]);
  const [industries, setIndustries] = useState<LocalIndustry[]>([]);

  const loadJobsByDistance = async () => {
    setView("jobsByDistance");
    setLoading(true);
    setError(null);
    try {
      const result = await fetchJobsByDistance({
        state,
        district,
        career: careerTitle ? { title: careerTitle } : undefined,
        language,
      });
      setJobs(result.jobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("opportunities.failedToLoad", "Failed to load opportunities"));
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingIndustries = async () => {
    setView("trendingIndustries");
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLocalIndustries({
        state,
        district,
        career: careerTitle ? { title: careerTitle } : undefined,
        language,
      });
      setIndustries(result.industries);
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("opportunities.failedToLoad", "Failed to load opportunities"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-purple-900/40 bg-[#111111] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label={tr("opportunities.close", "Close")}
        >
          <X className="w-5 h-5" />
        </button>

        {view === "choice" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-purple-300">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-semibold">
                {district}, {state}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {tr("opportunities.title", "Explore Opportunities Near You")}
            </h2>
            <p className="text-body-sm text-gray-400">
              {tr(
                "opportunities.subtitle",
                "We can show you real opportunities based on your location."
              )}
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={loadJobsByDistance}
                className="w-full text-left rounded-xl border border-purple-900/40 bg-[#0b0b0b] p-4 hover:border-purple-500 transition-colors"
              >
                <p className="font-semibold text-white">
                  {tr("opportunities.topJobsTitle", "Top 5 jobs for you, ranked by fit and distance")}
                </p>
                <p className="text-body-sm text-gray-400 mt-1">
                  {tr(
                    "opportunities.topJobsBody",
                    "See real job opportunities near your village or town, closest first."
                  )}
                </p>
              </button>

              <button
                type="button"
                onClick={loadTrendingIndustries}
                className="w-full text-left rounded-xl border border-purple-900/40 bg-[#0b0b0b] p-4 hover:border-purple-500 transition-colors"
              >
                <p className="font-semibold text-white">
                  {tr("opportunities.trendingTitle", "What's trending in your area?")}
                </p>
                <p className="text-body-sm text-gray-400 mt-1">
                  {tr(
                    "opportunities.trendingBody",
                    "Discover industries thriving near you right now."
                  )}
                </p>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-200"
            >
              {tr("opportunities.maybeLater", "Maybe later")}
            </button>
          </div>
        )}

        {(view === "jobsByDistance" || view === "trendingIndustries") && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setView("choice")}
              className="text-sm text-purple-300 hover:text-purple-200"
            >
              {tr("opportunities.back", "← Back")}
            </button>

            <h2 className="text-lg font-bold text-white">
              {view === "jobsByDistance"
                ? tr("opportunities.topJobsTitle", "Top 5 jobs for you, ranked by fit and distance")
                : tr("opportunities.trendingTitle", "What's trending in your area?")}
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-purple-900/40 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <p className="text-body-sm text-red-400">{error}</p>
            ) : view === "jobsByDistance" ? (
              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <p className="text-body-sm text-gray-400">
                    {tr("opportunities.noJobs", "No nearby opportunities found right now.")}
                  </p>
                ) : (
                  jobs.map((job, i) => (
                    <a
                      key={i}
                      href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                        job.title + " " + job.company
                      )}&location=India`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-lg border border-purple-900/40 bg-[#0b0b0b] p-4 hover:border-purple-500 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-white group-hover:text-purple-300">
                          {job.title}
                        </p>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-300 shrink-0" />
                      </div>
                      <p className="text-body-xs text-gray-400 mt-1">
                        {job.company} · {job.city}
                        {job.distanceKm !== null && (
                          <span className="text-purple-300">
                            {" "}
                            · {job.distanceKm} km {tr("opportunities.away", "away")}
                          </span>
                        )}
                      </p>
                      <p className="text-body-sm text-gray-300 mt-2">{job.reason}</p>
                    </a>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {industries.length === 0 ? (
                  <p className="text-body-sm text-gray-400">
                    {tr("opportunities.noIndustries", "No local data found right now.")}
                  </p>
                ) : (
                  industries.map((industry, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-purple-900/40 bg-[#0b0b0b] p-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-purple-300" />
                        <p className="font-semibold text-white">{industry.name}</p>
                      </div>
                      <p className="text-body-sm text-gray-300">{industry.reason}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
