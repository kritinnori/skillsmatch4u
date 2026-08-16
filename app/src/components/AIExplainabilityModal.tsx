import { useTranslation } from "react-i18next";
import { X, Sparkles, Shield } from "lucide-react";

interface AIExplainabilityModalProps {
  onClose: () => void;
}

export function AIExplainabilityModal({ onClose }: AIExplainabilityModalProps) {
  const { t } = useTranslation();
  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          aria-label={tr("ai.close", "Close")}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8 text-center">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-purple-400" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-white mb-2">
            {tr("ai.title", "How AI is Used")}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            {tr(
              "ai.shortDescription",
              "We use AI to analyze your quiz responses and suggest career paths that match your interests and strengths."
            )}
          </p>

          {/* Features - Simple list */}
          <div className="text-left space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <p className="text-sm text-gray-300">
                <span className="text-white font-medium">Quiz Analysis</span> — Your answers help identify career paths that fit you
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <p className="text-sm text-gray-300">
                <span className="text-white font-medium">Smart Matching</span> — AI finds relevant courses and job opportunities
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <p className="text-sm text-gray-300">
                <span className="text-white font-medium">Local Focus</span> — Suggestions consider your location when provided
              </p>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span>Your data is not stored • AI suggests, you decide</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium transition-colors"
          >
            {tr("ai.gotIt", "Got it")}
          </button>
        </div>
      </div>
    </div>
  );
}
