import { useTranslation } from "react-i18next";
import { X, Brain, BookOpen, MapPin, ShieldCheck } from "lucide-react";

interface AIExplainabilityModalProps {
  onClose: () => void;
}

export function AIExplainabilityModal({ onClose }: AIExplainabilityModalProps) {
  const { t } = useTranslation();
  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

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
          aria-label={tr("ai.close", "Close")}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <Brain className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {tr("ai.title", "How AI is Used")}
              </h2>
              <p className="text-body-xs text-gray-400">
                {tr("common.brand", "skillsmatch4u")}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-body-sm text-gray-300">
            {tr(
              "ai.description",
              "SkillsMatch4U uses artificial intelligence to provide personalized career guidance for students based on their interests, aptitudes, and preferences."
            )}
          </p>

          {/* How it works */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">
              {tr("ai.howItWorksTitle", "How it works:")}
            </h3>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-purple-900/20 rounded-md shrink-0 mt-0.5">
                  <Brain className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {tr("ai.feature1Title", "Quiz Analysis")}
                  </p>
                  <p className="text-body-xs text-gray-400">
                    {tr(
                      "ai.feature1Body",
                      "Your quiz responses (interest and aptitude ratings on a 1–5 scale) are processed by an AI language model to identify a career path that matches your strengths and preferences."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-purple-900/20 rounded-md shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {tr("ai.feature2Title", "Course & Job Matching")}
                  </p>
                  <p className="text-body-xs text-gray-400">
                    {tr(
                      "ai.feature2Body",
                      "Based on your career match, the AI generates relevant course recommendations from vocational and online learning platforms, along with entry-level job opportunities."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-purple-900/20 rounded-md shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {tr("ai.feature3Title", "Location-Aware Suggestions")}
                  </p>
                  <p className="text-body-xs text-gray-400">
                    {tr(
                      "ai.feature3Body",
                      "When you provide your location, the AI identifies local industries and nearby job opportunities relevant to your career match."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg border border-purple-900/30 bg-purple-950/20 p-4">
            <div className="flex gap-2 items-start">
              <ShieldCheck className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-body-xs text-gray-300">
                  {tr(
                    "ai.disclaimer1",
                    "AI provides suggestions only — it does not make decisions for you."
                  )}
                </p>
                <p className="text-body-xs text-gray-300">
                  {tr(
                    "ai.disclaimer2",
                    "Your quiz responses are processed in real-time and are not stored by the AI service or used to train any AI model."
                  )}
                </p>
                <p className="text-body-xs text-gray-300">
                  {tr(
                    "ai.disclaimer3",
                    "Recommendations are generated based on patterns in your responses, not on personal identity data."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
