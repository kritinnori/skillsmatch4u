import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HomePageProps {
  onStartQuiz: () => void;
}

export function HomePage({ onStartQuiz }: HomePageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, #fbbf24 0%, #f97316 25%, #10b981 50%, #3b82f6 75%, #a855f7 100%)",
              clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
            }}
          />
          <span className="text-2xl font-bold ml-1">{t("common.brand")}</span>
        </div>

        <LanguageSwitcher />
      </nav>

      <div className="max-w-2xl mx-auto px-4 md:px-6 pb-8">
        <div className="space-y-8 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t("home.title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
              {t("home.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-8">
            <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/30">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">{t("home.feature1Title")}</h3>
              <p className="text-sm text-gray-400">{t("home.feature1Body")}</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/30">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">{t("home.feature2Title")}</h3>
              <p className="text-sm text-gray-400">{t("home.feature2Body")}</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/30">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">{t("home.feature3Title")}</h3>
              <p className="text-sm text-gray-400">{t("home.feature3Body")}</p>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <Button
              onClick={onStartQuiz}
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-12 py-6"
            >
              {t("home.startCta")}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl justify-center items-center flex flex-col mx-auto px-4 md:px-6 pb-8 mt-12 space-y-4">
        <div className="flex items-center gap-2 border-2 border-gray-800 rounded-2xl py-1 px-2 text-sm text-gray-400">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-[#0a0a0a]"
                style={{
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
                }}
              />
            ))}
          </div>
          <span>{t("common.trustBadge")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span>{t("common.personalizedMatching")}</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-500 pt-2">
          <span>FOX</span>
          <span>CNN</span>
          <span>WSJ</span>
          <span>TechCrunch</span>
          <span>MSNBC</span>
        </div>
      </div>
    </div>
  );
}
