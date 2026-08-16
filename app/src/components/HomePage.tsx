import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Target,
  Zap,
  BarChart3,
  MapPin,
  LogOut,
  Globe,
  Shield,
  Lock,
  GraduationCap,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  FileText,
} from "lucide-react";
import type { AuthUser } from "../lib/auth";
import { Button } from "./ui/button";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { signOut as cognitoSignOut } from "../lib/auth";
import { AIExplainabilityModal } from "./AIExplainabilityModal";
import { SignOutModal } from "./SignOutModal";

interface HomePageProps {
  onStartQuiz: () => void;
  onLogin: () => void;
  onDashboard: () => void;
  onShowOpportunities?: () => void;
  user: AuthUser | null;
  hasCompletedQuiz?: boolean;
}

const featureIcons = [Target, Zap, BarChart3] as const;

export function HomePage({ onStartQuiz, onLogin, onDashboard, onShowOpportunities, user, hasCompletedQuiz }: HomePageProps) {
  const { t } = useTranslation();
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Close avatar menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U";
    const email = user.email;
    const name = email.split("@")[0];
    if (name.length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    setShowSignOutConfirm(false);
    cognitoSignOut();
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
    <div className="w-full min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Background decoration - subtle gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
      <header className="bg-[#050505] border-b border-purple-900/40 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-3 sm:px-4 md:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-2">

          {/* Brand */}
          <BrandLogo
            label={t("common.brand")}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="shrink-0 min-w-0"
          />

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* AI badge */}
            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="flex w-9 h-9 items-center justify-center text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors border border-purple-700/60 text-xs font-bold"
              aria-label={t("ai.title", { defaultValue: "How AI is Used" })}
            >
              AI
            </button>

            {/* Location - only for logged-in users */}
            {onShowOpportunities && user && (
              <button
                type="button"
                onClick={onShowOpportunities}
                className="flex w-9 h-9 items-center justify-center text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors"
                aria-label={t("opportunities.title", { defaultValue: "Explore Opportunities Near You" })}
              >
                <MapPin className="w-4 h-4" />
              </button>
            )}

            {/* Avatar dropdown for logged-in users */}
            {user ? (
              <div className="relative" ref={avatarMenuRef}>
                <button
                  type="button"
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-gray-200 hover:bg-purple-900/30 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {getUserInitials()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${avatarMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {avatarMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-purple-900/40 rounded-xl shadow-xl py-2 z-50">
                    <button
                      onClick={() => { onDashboard?.(); setAvatarMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-200 hover:bg-purple-900/30 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">{t("nav.myCareer", { defaultValue: "My Career" })}</span>
                    </button>
                    
                    <div className="border-t border-purple-900/30 my-1.5" />
                    
                    <button
                      onClick={() => { setShowSignOutConfirm(true); setAvatarMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">{t("login.signOut", { defaultValue: "Sign out" })}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={onLogin}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white font-semibold text-sm px-4 h-9"
              >
                {t("login.signIn", { defaultValue: "Sign In" })}
              </Button>
            )}

            <LanguageSwitcher />
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {/* AI badge - always visible */}
            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="flex w-8 h-8 items-center justify-center text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors border border-purple-700/60 text-[10px] font-bold"
              aria-label={t("ai.title", { defaultValue: "How AI is Used" })}
            >
              AI
            </button>

            {/* Sign in (when not logged in) */}
            {!user && (
              <Button
                onClick={onLogin}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold text-xs px-3 h-8"
              >
                {t("login.signIn", { defaultValue: "Sign In" })}
              </Button>
            )}

            <LanguageSwitcher />

            {/* Hamburger menu (only when logged in) */}
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-purple-900/30 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-purple-900/30 bg-[#0a0a0a] px-4 py-3 space-y-1">
            <button
              onClick={() => { onDashboard?.(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-200 hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">{t("nav.myCareer", { defaultValue: "My Career" })}</span>
            </button>
            
            {onShowOpportunities && (
              <button
                onClick={() => { onShowOpportunities(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-200 hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">{t("opportunities.title", { defaultValue: "Explore Opportunities" })}</span>
              </button>
            )}
            
            <button
              onClick={() => { setShowAIModal(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-200 hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">{t("ai.title", { defaultValue: "How AI is Used" })}</span>
            </button>

            <div className="border-t border-purple-900/30 pt-2 mt-2">
              <button
                onClick={() => { setShowSignOutConfirm(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">{t("login.signOut", { defaultValue: "Sign out" })}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Clean, bold, lots of breathing room */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            {t("home.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>
          <Button
            onClick={onStartQuiz}
            size="lg"
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-full shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 transition-all"
          >
            {hasCompletedQuiz ? t("home.retakeCta", { defaultValue: "Retake Assessment" }) : t("home.startCta")}
          </Button>
          {hasCompletedQuiz && (
            <p className="text-sm text-gray-500 mt-4">
              {t("home.retakeNote", { defaultValue: "You've completed the assessment. Retaking will update your recommendations." })}
            </p>
          )}
        </div>
      </section>

      {/* How It Works - Minimal, clean steps */}
      <section className="py-12 sm:py-16 md:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {t("home.howItWorksTitle")}
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
              {t("home.howItWorksSubtitle")}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 md:gap-8">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="text-center p-6 sm:p-8"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-purple-600/20 text-purple-400 rounded-full font-bold text-lg sm:text-xl mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Clean cards with subtle styling */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="space-y-4 sm:grid sm:grid-cols-3 sm:space-y-0 sm:gap-6">
            {features.map(({ title, body, Icon }) => (
              <div
                key={title}
                className="bg-[#0f0f0f] rounded-2xl p-6 sm:p-7"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/15 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SkillsMatch4u - Differentiators */}
      <section className="py-12 sm:py-16 md:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {t("home.whyTitle", { defaultValue: "Why SkillsMatch4u?" })}
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
              {t("home.whySubtitle", { defaultValue: "Career guidance designed for real students" })}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl bg-[#0a0a0a]">
              <div className="w-10 h-10 bg-purple-600/15 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                  {t("home.why1Title", { defaultValue: "13 Languages" })}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("home.why1Body", { defaultValue: "Take the assessment in Hindi, Tamil, Telugu, Bengali, and 9 more Indian languages" })}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl bg-[#0a0a0a]">
              <div className="w-10 h-10 bg-purple-600/15 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                  {t("home.why2Title", { defaultValue: "100% Free" })}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("home.why2Body", { defaultValue: "No hidden fees, no subscriptions, no credit card required" })}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl bg-[#0a0a0a]">
              <div className="w-10 h-10 bg-purple-600/15 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                  {t("home.why3Title", { defaultValue: "Privacy First" })}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("home.why3Body", { defaultValue: "Your data is never sold. AI processes responses without storing them" })}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl bg-[#0a0a0a]">
              <div className="w-10 h-10 bg-purple-600/15 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                  {t("home.why4Title", { defaultValue: "Built by Students" })}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("home.why4Body", { defaultValue: "Created by students who understand what students actually need" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#080808]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {t("home.faqTitle", { defaultValue: "Frequently Asked Questions" })}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0f0f0f] p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                {t("home.faq1Q", { defaultValue: "How does the career assessment work?" })}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {t("home.faq1A", { defaultValue: "Answer 20 questions about your interests and work style. Our AI analyzes your responses to match you with careers that fit your personality and strengths." })}
              </p>
            </div>

            <div className="rounded-2xl bg-[#0f0f0f] p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                {t("home.faq2Q", { defaultValue: "Is it really free?" })}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {t("home.faq2A", { defaultValue: "Yes, completely free. No account required to take the assessment. We believe career guidance should be accessible to everyone." })}
              </p>
            </div>

            <div className="rounded-2xl bg-[#0f0f0f] p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                {t("home.faq3Q", { defaultValue: "What happens after I complete the assessment?" })}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {t("home.faq3A", { defaultValue: "You'll get your top career match with a compatibility score, recommended courses from top platforms, and relevant job opportunities." })}
              </p>
            </div>

            <div className="rounded-2xl bg-[#0f0f0f] p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                {t("home.faq4Q", { defaultValue: "How long does the assessment take?" })}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {t("home.faq4A", { defaultValue: "About 5 minutes. It's designed to be quick and easy while still providing meaningful insights." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 sm:py-10 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {t("common.brand")}
            </p>
            <div className="flex items-center gap-6">
              <a href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">
                About
              </a>
              <a href="/privacy-policy" className="text-sm text-gray-500 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>

      </div>{/* End of relative z-10 content wrapper */}

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
