import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Brain,
  Target,
  Zap,
  BarChart3,
  ChevronRight,
  MapPin,
  UserCircle,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "../lib/supabase";
import { AIExplainabilityModal } from "./AIExplainabilityModal";
import { SignOutModal } from "./SignOutModal";

interface HomePageProps {
  onStartQuiz: () => void;
  onLogin: () => void;
  onDashboard: () => void;
  onShowOpportunities?: () => void;
  user: User | null;
}

const featureIcons = [Target, Zap, BarChart3] as const;

export function HomePage({ onStartQuiz, onLogin, onDashboard, onShowOpportunities, user }: HomePageProps) {
  const { t } = useTranslation();
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutConfirm(false);
    await supabase.auth.signOut();
  };

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
    <div className="w-full min-h-screen bg-[#050505] text-white">
      <header className="bg-[#050505] border-b border-purple-900/40 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">
          <BrandLogo
            label={t("common.brand")}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="flex items-center justify-center px-2 py-1.5 text-purple-300 hover:bg-purple-900/30 rounded-lg transition-colors border border-purple-700/60 text-xs font-bold"
              aria-label={t("ai.title", { defaultValue: "How AI is Used" })}
              title={t("ai.title", { defaultValue: "How AI is Used" })}
            >
              AI
            </button>
            {onShowOpportunities && (
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    onLogin();
                  } else {
                    onShowOpportunities();
                  }
                }}
                className="flex items-center justify-center p-2 text-purple-300 hover:bg-purple-900/30 rounded-lg transition-colors"
                aria-label={t("opportunities.title", { defaultValue: "Explore Opportunities Near You" })}
                title={t("opportunities.title", { defaultValue: "Explore Opportunities Near You" })}
              >
                <MapPin className="w-5 h-5" />
              </button>
            )}
            {user && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("sm4u:openProfile"))}
                className="flex items-center justify-center p-2 text-purple-300 hover:bg-purple-900/30 rounded-lg transition-colors"
                aria-label={t("profile.title", { defaultValue: "My Profile" })}
                title={t("profile.title", { defaultValue: "My Profile" })}
              >
                <UserCircle className="w-5 h-5" />
              </button>
            )}
            {user && (
              <Button
                onClick={onDashboard}
                size="sm"
                className="hidden sm:inline-flex bg-purple-700 hover:bg-purple-600 text-white font-semibold text-sm px-4"
              >
                {t("dashboard.title", { defaultValue: "My Dashboard" })}
              </Button>
            )}
            {user ? (
              <Button
                onClick={() => setShowSignOutConfirm(true)}
                size="sm"
                className="hidden sm:inline-flex bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm px-4"
              >
                {t("login.signOut", { defaultValue: "Sign out" })}
              </Button>
            ) : (
              <Button
                onClick={onLogin}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold text-sm px-4"
              >
                {t("login.signIn", { defaultValue: "Login" })}
              </Button>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <section className="bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.25),transparent_40%)] py-16 md:py-24 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {t("home.title")}
              </h1>
              <p className="text-body-lg text-gray-300 mb-8 max-w-xl">
                {t("home.subtitle")}
              </p>
              <Button
                onClick={onStartQuiz}
                size="lg"
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-8 py-6 text-lg shadow-md hover:shadow-lg"
              >
                {t("home.startCta")}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-full max-w-md h-80 bg-gradient-to-br from-purple-900/40 to-purple-700/30 rounded-xl shadow-lg flex items-center justify-center border border-purple-800/40">
                <div className="text-center px-8">
                  <Brain className="w-20 h-20 text-purple-300 mx-auto mb-4 opacity-80" />
                  <p className="text-gray-300 font-semibold">
                    {t("common.personalizedMatching")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-b border-purple-900/40 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t("home.howItWorksTitle")}
            </h2>
            <p className="text-body-lg text-gray-300 max-w-2xl mx-auto">
              {t("home.howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-[#111111] border-2 border-purple-900/40 rounded-xl p-8 text-center h-full hover:border-purple-500 hover:shadow-md transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-900/40 text-purple-300 rounded-lg font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-h4 font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-body-sm text-gray-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#080808] border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ title, body, Icon }) => (
              <div
                key={title}
                className="bg-[#111111] rounded-xl p-8 shadow-sm border border-purple-900/40 hover:shadow-md transition-all duration-300"
              >
                <div className="p-3 bg-purple-900/30 rounded-lg w-fit mb-4">
                  <Icon className="w-7 h-7 text-purple-300" />
                </div>
                <h3 className="text-h4 font-bold text-white mb-2">{title}</h3>
                <p className="text-body-sm text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-r from-purple-800 to-purple-950">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-body-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            {t("home.ctaSubtitle")}
          </p>
          <Button
            onClick={onStartQuiz}
            size="lg"
            className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-10 py-6 text-lg shadow-lg"
          >
            {t("home.startCta")}
          </Button>
          <p className="text-purple-100 text-body-sm mt-4">
            {t("home.ctaNote")}
          </p>
        </div>
      </section>

      <footer className="bg-black text-white py-8 border-t border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-body-xs text-gray-500">
              &copy; {new Date().getFullYear()} {t("common.brand")}. {t("common.trustBadge")}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/about"
                className="text-body-xs text-gray-400 hover:text-purple-300 transition-colors"
              >
                About
              </a>
              <span className="text-gray-700">|</span>
              <a
                href="/privacy-policy"
                className="text-body-xs text-gray-400 hover:text-purple-300 transition-colors"
              >
                {t("privacy.title", { defaultValue: "Privacy Policy" })}
              </a>
              <span className="text-gray-700">|</span>
              <a
                href="/terms"
                className="text-body-xs text-gray-400 hover:text-purple-300 transition-colors"
              >
                {t("terms.title", { defaultValue: "Terms & Conditions" })}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showAIModal && <AIExplainabilityModal onClose={() => setShowAIModal(false)} />}
      {showSignOutConfirm && (
        <SignOutModal
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}
    </div>
  );
}
