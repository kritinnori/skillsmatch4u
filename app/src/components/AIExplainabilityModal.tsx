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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-purple-900/30 bg-[#0c0c0c] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0c0c0c] border-b border-purple-900/20 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/15 rounded-xl">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {tr("ai.title", "How AI is Used")}
              </h2>
              <p className="text-xs text-gray-500">
                {tr("common.brand", "skillsmatch4u")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label={tr("ai.close", "Close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed">
            {tr(
              "ai.description",
              "SkillsMatch4U uses artificial intelligence to provide personalized career guidance for students based on their interests, aptitudes, and preferences."
            )}
          </p>

          {/* How it works */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              {tr("ai.howItWorksTitle", "How it works")}
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">
                    {tr("ai.feature1Title", "Quiz Analysis")}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {tr(
                      "ai.feature1Body",
                      "Your quiz responses are processed by AI to identify a career path that matches your strengths and preferences."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">
                    {tr("ai.feature2Title", "Course & Job Matching")}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {tr(
                      "ai.feature2Body",
                      "Based on your career match, AI recommends relevant courses and entry-level job opportunities."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">
                    {tr("ai.feature3Title", "Location-Aware Suggestions")}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {tr(
                      "ai.feature3Body",
                      "When you share your location, AI identifies nearby industries and job opportunities."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl bg-[#111] border border-gray-800/50 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="text-gray-300 font-medium">AI provides suggestions only</span> — it does not make decisions for you.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your responses are processed in real-time and <span className="text-gray-300 font-medium">not stored</span> by the AI service.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Recommendations are based on <span className="text-gray-300 font-medium">response patterns</span>, not personal identity data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
