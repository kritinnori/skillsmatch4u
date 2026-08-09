import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { PageHeader } from "./layout/PageHeader";
import { INDIAN_STATES } from "../lib/indianStates";

interface LocationPageProps {
  onContinue: (state: string, district: string) => void;
  onSkip: () => void;
  onBack?: () => void;
}

export function LocationPage({ onContinue, onSkip, onBack }: LocationPageProps) {
  const { t } = useTranslation();
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  const canContinue = state.trim().length > 0 && district.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-purple-500/6 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <PageHeader
          brand={t("common.brand")}
          onHome={onBack}
          sticky
        />

        <main className="flex-1 flex flex-col px-4 py-6 sm:py-10 md:py-16">
          {/* Back link - mobile */}
          {onBack && (
            <div className="w-full max-w-md mx-auto mb-6 md:hidden">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("common.goBack", { defaultValue: "Back" })}
              </button>
            </div>
          )}

          <div className="flex-1 flex items-center justify-center">
            <section className="w-full max-w-md bg-[#0c0c0c] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-purple-600/15 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <h1 className="text-xl font-bold">
                  {tr("location.title", "Where are you located?")}
                </h1>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {tr(
                  "location.subtitle",
                  "We'll use this to show you industries and opportunities thriving near you. This isn't saved to your profile."
                )}
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {tr("location.state", "State")}
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-lg border border-purple-900/40 bg-[#050505] px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="" disabled>
                      {tr("location.selectState", "Select your state")}
                    </option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {tr("location.district", "District or town")}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={tr("location.districtPlaceholder", "e.g. Krishna, Dindi")}
                    className="w-full rounded-lg border border-purple-900/40 bg-[#050505] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <Button
                  onClick={() => canContinue && onContinue(state, district)}
                  disabled={!canContinue}
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 text-sm disabled:opacity-50 transition-colors"
                >
                  {tr("location.continue", "Continue")}
                </Button>

                <button
                  type="button"
                  onClick={onSkip}
                  className="w-full text-center text-sm text-gray-400 hover:text-purple-300 transition-colors"
                >
                  {tr("location.skip", "Skip for now")}
                </button>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <p className="text-xs text-gray-600 text-center sm:text-left">
              &copy; {new Date().getFullYear()} {t("common.brand")}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
