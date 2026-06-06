import { useTranslation } from "react-i18next";
import {
  Brain,
  Target,
  Zap,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HomePageProps {
  onStartQuiz: () => void;
}

const featureIcons = [Target, Zap, BarChart3] as const;

export function HomePage({ onStartQuiz }: HomePageProps) {
  const { t } = useTranslation();

  const features = [
    {
      title: t("home.feature1Title"),
      body: t("home.feature1Body"),
      Icon: featureIcons[0],
    },
    {
      title: t("home.feature2Title"),
      body: t("home.feature2Body"),
      Icon: featureIcons[1],
    },
    {
      title: t("home.feature3Title"),
      body: t("home.feature3Body"),
      Icon: featureIcons[2],
    },
  ];

  const steps = [
    { step: "01", title: t("home.step1Title"), body: t("home.step1Body") },
    { step: "02", title: t("home.step2Title"), body: t("home.step2Body") },
    { step: "03", title: t("home.step3Title"), body: t("home.step3Body") },
  ];

  return (
    <div className="w-full bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <BrandLogo label={t("common.brand")} />
          <LanguageSwitcher />
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {t("home.title")}
              </h1>
              <p className="text-body-lg text-gray-600 mb-8 max-w-xl">
                {t("home.subtitle")}
              </p>
              <Button
                onClick={onStartQuiz}
                size="lg"
                className="bg-primary-800 hover:bg-primary-900 text-white font-semibold px-8 py-6 text-lg shadow-md hover:shadow-lg"
              >
                {t("home.startCta")}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-full max-w-md h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl shadow-lg flex items-center justify-center border border-primary-200">
                <div className="text-center px-8">
                  <Brain className="w-20 h-20 text-primary-800 mx-auto mb-4 opacity-80" />
                  <p className="text-gray-700 font-semibold">
                    {t("common.personalizedMatching")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t("home.howItWorksTitle")}
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              {t("home.howItWorksSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-white border-2 border-primary-100 rounded-xl p-8 text-center h-full hover:border-primary-300 hover:shadow-md transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-800 rounded-lg font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-h4 font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-body-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ title, body, Icon }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="p-3 bg-primary-50 rounded-lg w-fit mb-4">
                  <Icon className="w-7 h-7 text-primary-800" />
                </div>
                <h3 className="text-h4 font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-body-sm text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-800 to-primary-900">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-body-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            {t("home.ctaSubtitle")}
          </p>
          <Button
            onClick={onStartQuiz}
            size="lg"
            className="bg-white text-primary-800 hover:bg-gray-100 font-bold px-10 py-6 text-lg shadow-lg"
          >
            {t("home.startCta")}
          </Button>
          <p className="text-primary-100 text-body-sm mt-4">{t("home.ctaNote")}</p>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-body-sm text-gray-400">{t("common.trustBadge")}</p>
          <p className="text-body-xs text-gray-500 mt-2">
            © {new Date().getFullYear()} {t("common.brand")}
          </p>
        </div>
      </footer>
    </div>
  );
}
