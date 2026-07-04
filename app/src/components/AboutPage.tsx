import { useTranslation } from "react-i18next";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Brain, Users, Target, Heart, Globe, Shield, Sparkles } from "lucide-react";

interface AboutPageProps {
  onBack: () => void;
  onHome?: () => void;
}

export function AboutPage({ onBack, onHome }: AboutPageProps) {
  const { t } = useTranslation();

  const goHome = onHome || onBack;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-[#050505] sticky top-0 z-20">
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">
          <BrandLogo label={t("common.brand")} onClick={goHome} />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero — centered, full width */}
      <section className="w-full px-4 md:px-10 py-20 md:py-28 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
          Empowering students to discover their career path
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
          SkillsMatch4U is an AI-powered career guidance platform that helps students identify their strengths, explore matching careers, and find courses and opportunities to get started.
        </p>
      </section>

      {/* Mission — two column */}
      <section className="w-full px-4 md:px-10 py-16 border-t border-purple-900/30">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-body-sm text-gray-300 leading-relaxed">
              Career decisions are among the most important choices a student makes — yet most lack access to personalized guidance. SkillsMatch4U bridges this gap by combining a research-backed assessment with AI to deliver tailored career recommendations, relevant learning pathways, and real job opportunities.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Belief</h2>
            <p className="text-body-sm text-gray-300 leading-relaxed">
              Every student — regardless of background, location, or economic status — deserves clarity about their future. Our platform is free, multilingual, and designed to meet students where they are. No barriers, no paywalls, no gatekeeping.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do — full-width 3-column grid */}
      <section className="w-full px-4 md:px-10 py-16 border-t border-purple-900/30">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">What We Do</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8">
            <Brain className="w-7 h-7 text-purple-300 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">AI Career Matching</h3>
            <p className="text-body-sm text-gray-400 leading-relaxed">
              A 20-question assessment analyzed by AI to identify your ideal career path based on your interests, aptitudes, and work style.
            </p>
          </div>
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8">
            <Target className="w-7 h-7 text-purple-300 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">Course Recommendations</h3>
            <p className="text-body-sm text-gray-400 leading-relaxed">
              Curated suggestions from vocational programs, government platforms, and online learning providers — relevant to your matched career.
            </p>
          </div>
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8">
            <Users className="w-7 h-7 text-purple-300 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">Job Opportunities</h3>
            <p className="text-body-sm text-gray-400 leading-relaxed">
              Realistic entry-level job suggestions matched to your career profile, with location-based discovery when you share your region.
            </p>
          </div>
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8">
            <Globe className="w-7 h-7 text-purple-300 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">13 Languages</h3>
            <p className="text-body-sm text-gray-400 leading-relaxed">
              Fully multilingual interface ensuring accessibility for students across diverse linguistic backgrounds.
            </p>
          </div>
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8">
            <Shield className="w-7 h-7 text-purple-300 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">Privacy-First</h3>
            <p className="text-body-sm text-gray-400 leading-relaxed">
              Your data is never sold or used for advertising. AI processes your responses in real-time without storing them.
            </p>
          </div>
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8">
            <Heart className="w-7 h-7 text-purple-300 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">Completely Free</h3>
            <p className="text-body-sm text-gray-400 leading-relaxed">
              No subscriptions, no credit cards, no hidden fees. Career guidance should be accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Built by students */}
      <section className="w-full px-4 md:px-10 py-16 border-t border-purple-900/30">
        <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Built By Students, For Students</h2>
            <p className="text-body-sm text-gray-300 leading-relaxed mb-4">
              SkillsMatch4U was created by a team of high school students passionate about making career guidance accessible to everyone. What started as a project has grown into a full platform serving students across multiple regions.
            </p>
            <p className="text-body-sm text-gray-300 leading-relaxed">
              We continue to develop and improve — adding new features, expanding language support, and ensuring our AI recommendations remain helpful, accurate, and safe for all users.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="rounded-xl border border-purple-900/30 bg-gradient-to-br from-purple-900/20 to-purple-700/10 p-10 text-center">
              <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <p className="text-2xl font-bold text-white mb-1">Student-Built</p>
              <p className="text-body-sm text-gray-400">Designed with real student needs in mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full px-4 md:px-10 py-16 border-t border-purple-900/30">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">What Drives Us</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8 text-center">
            <p className="text-lg font-semibold text-white mb-2">Accessibility</p>
            <p className="text-body-sm text-gray-400">Free to use, available in 13 languages, designed for students everywhere.</p>
          </div>
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8 text-center">
            <p className="text-lg font-semibold text-white mb-2">Transparency</p>
            <p className="text-body-sm text-gray-400">Clear about how AI is used, what data we collect, and how we protect your privacy.</p>
          </div>
          <div className="rounded-xl border border-purple-900/30 bg-[#0a0a0a] p-8 text-center">
            <p className="text-lg font-semibold text-white mb-2">Student-First</p>
            <p className="text-body-sm text-gray-400">Every feature is built with students in mind — practical, honest, and actionable.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 py-6 mt-8">
        <div className="w-full px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-xs text-gray-600">
            &copy; {new Date().getFullYear()} {t("common.brand")}
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy-policy" className="text-body-xs text-gray-500 hover:text-purple-300 transition-colors">Privacy Policy</a>
            <span className="text-gray-700">|</span>
            <a href="/terms" className="text-body-xs text-gray-500 hover:text-purple-300 transition-colors">Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
