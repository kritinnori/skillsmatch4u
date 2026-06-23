import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { INDIAN_STATES } from "../lib/indianStates";

interface LocationPageProps {
  onContinue: (state: string, district: string) => void;
  onSkip: () => void;
}

export function LocationPage({ onContinue, onSkip }: LocationPageProps) {
  const { t } = useTranslation();
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  const canContinue = state.trim().length > 0 && district.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />
      <div className="relative z-10">
        <header className="border-b border-purple-900/40 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <BrandLogo label={t("common.brand")} />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-16 md:py-24">
          <section className="bg-[#111111] border border-purple-900/40 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold">
                {tr("location.title", "Where are you located?")}
              </h1>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              {tr(
                "location.subtitle",
                "We'll use this to show you industries and opportunities thriving near you. This isn't saved to your profile."
              )}
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-300">
                  {tr("location.state", "State")}
                </span>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-purple-900/50 bg-[#080808] px-4 py-3 text-white outline-none focus:border-purple-500"
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
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-300">
                  {tr("location.district", "District or town")}
                </span>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={tr("location.districtPlaceholder", "e.g. Krishna, Dindi")}
                  className="mt-2 w-full rounded-lg border border-purple-900/50 bg-[#080808] px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
                />
              </label>

              <Button
                onClick={() => canContinue && onContinue(state, district)}
                disabled={!canContinue}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-6 disabled:opacity-50"
              >
                {tr("location.continue", "Continue")}
              </Button>

              <button
                type="button"
                onClick={onSkip}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-200"
              >
                {tr("location.skip", "Skip for now")}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
