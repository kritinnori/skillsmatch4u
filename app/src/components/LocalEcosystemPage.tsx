import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { PageHeader } from "./layout/PageHeader";
import { Button } from "./ui/button";
import { fetchLocalIndustries, type LocalIndustry } from "../lib/api";

interface LocalEcosystemPageProps {
  state: string;
  district: string;
  currentCareerTitle?: string;
  onBack: () => void;
  onHome?: () => void;
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onDashboard?: () => void;
}

const CardSkeleton = () => (
  <div className="rounded-xl border border-purple-900/40 bg-[#111111] p-5">
    <div className="h-5 w-1/2 skeleton-shimmer rounded" />
    <div className="h-3 w-full skeleton-shimmer rounded mt-3" />
    <div className="h-3 w-3/4 skeleton-shimmer rounded mt-2" />
  </div>
);

export function LocalEcosystemPage({
  state,
  district,
  currentCareerTitle,
  onBack,
  onHome,
  user,
  onSignOut,
  onDashboard,
}: LocalEcosystemPageProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";

  const [location, setLocation] = useState<string>("");
  const [industries, setIndustries] = useState<LocalIndustry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchLocalIndustries({
          state,
          district,
          career: currentCareerTitle ? { title: currentCareerTitle } : undefined,
          language,
        });
        if (cancelled) return;
        setLocation(result.location);
        setIndustries(result.industries);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : tr("location.failedToLoad", "Failed to load local opportunities"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [state, district, currentCareerTitle, language]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />
      <div className="relative z-10">
        <PageHeader
          brand={t("common.brand")}
          onBack={onBack}
          backLabel={t("common.goBack", { defaultValue: "Go back" })}
          title={tr("location.pageTitle", "Thriving Near You")}
          user={user}
          onSignOut={onSignOut}
          onHome={onHome}
          onDashboard={onDashboard}
          sticky
        />

        <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 pb-16 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-purple-300 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              {location || `${district}, ${state}`}
            </div>
            <p className="text-gray-400 text-sm">
              {tr(
                "location.intro",
                "Industries and opportunities thriving in your area right now."
              )}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : error || !industries?.length ? (
            <div className="text-center bg-[#111111] rounded-xl border border-purple-900/40 p-10">
              <p className="text-gray-300">
                {error || tr("location.noData", "We couldn't find local data right now.")}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {industries.map((industry, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-5 ${
                    industry.matchesUserCareer
                      ? "border-purple-500 bg-purple-950/30"
                      : "border-purple-900/40 bg-[#111111]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-300 shrink-0" />
                      <h3 className="text-lg font-bold text-white">{industry.name}</h3>
                    </div>
                    {industry.matchesUserCareer && (
                      <span className="text-xs font-semibold text-purple-300 bg-purple-900/40 px-3 py-1 rounded-full whitespace-nowrap">
                        {tr("location.matchesYourPath", "Matches your path")}
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm text-gray-300 leading-relaxed">{industry.reason}</p>

                  {!industry.matchesUserCareer && currentCareerTitle && (
                    <Button
                      variant="outline"
                      className="mt-4 border-purple-900/50 bg-[#0b0b0b] text-white hover:bg-purple-950/50"
                    >
                      {tr("location.exploreInstead", "Explore this instead")}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
