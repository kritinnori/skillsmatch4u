import { useTranslation } from "react-i18next";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface PrivacyPolicyPageProps {
  onBack: () => void;
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
}

export function PrivacyPolicyPage({ onBack, onHome }: PrivacyPolicyPageProps) {
  const { t } = useTranslation();
  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  const goHome = onHome || onBack;

  const sections = [
    { id: "collect", num: "1", title: tr("privacy.collectTitle", "Information We Collect") },
    { id: "purpose", num: "2", title: tr("privacy.useTitle", "Purpose & Lawful Basis for Processing") },
    { id: "minors", num: "3", title: tr("privacy.minorsTitle", "Data Protection for Minors") },
    { id: "rights", num: "4", title: tr("privacy.deletionTitle", "Your Rights") },
    { id: "thirdparty", num: "5", title: tr("privacy.thirdPartyTitle", "Third-Party Data Processors") },
    { id: "contact", num: "6", title: tr("privacy.contactTitle", "Contact") },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-[#050505] sticky top-0 z-20">
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">
          <BrandLogo label={t("common.brand")} onClick={goHome} />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Content */}
      <div className="w-full px-4 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">

          {/* Sidebar — section nav (hidden on mobile) */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <h1 className="text-2xl font-bold text-white mb-1">
              {tr("privacy.title", "Privacy Policy")}
            </h1>
            <p className="text-body-xs text-gray-500 mb-6">
              {tr("privacy.subtitle", "Last updated: July 2025")}
            </p>
            <nav className="space-y-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(s.id);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  className="block text-body-sm text-gray-400 hover:text-purple-300 transition-colors py-1 text-left"
                >
                  {s.num}. {s.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="max-w-none">
            {/* Mobile title (hidden on desktop since sidebar has it) */}
            <div className="lg:hidden mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                {tr("privacy.title", "Privacy Policy")}
              </h1>
              <p className="text-body-xs text-gray-500">
                {tr("privacy.subtitle", "Last updated: July 2025")}
              </p>
            </div>

            {/* Intro */}
            <div className="rounded-lg bg-[#111111] border border-purple-900/30 px-4 py-3 mb-8">
              <p className="text-body-xs text-gray-400 italic">
                This document is available in English only. In the event of any conflict between a translated version and the English version, the English version shall prevail.
              </p>
            </div>

            <p className="text-body-sm text-gray-300 leading-relaxed mb-10">
              {tr(
                "privacy.intro",
                "This Privacy Policy describes how SkillsMatch4U (\"we\", \"us\", or \"our\") collects, uses, and protects personal data when you use our platform. By accessing or using SkillsMatch4U, you consent to the data practices described in this policy."
              )}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {/* 1 */}
              <section id="collect">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  1. {tr("privacy.collectTitle", "Information We Collect")}
                </h2>
                <ul className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <li>{tr("privacy.collect1", "Account information: email address provided during registration")}</li>
                  <li>{tr("privacy.collect2", "Assessment data: your responses to career assessment questions")}</li>
                  <li>{tr("privacy.collect3", "Location data: state/region and district (provided voluntarily)")}</li>
                  <li>{tr("privacy.collect4", "Usage data: interactions with recommended courses and job listings")}</li>
                </ul>
              </section>

              {/* 2 */}
              <section id="purpose">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  2. {tr("privacy.useTitle", "Purpose & Lawful Basis for Processing")}
                </h2>
                <ul className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <li>{tr("privacy.use1", "To provide personalized career recommendations \u2014 processed on the basis of your consent")}</li>
                  <li>{tr("privacy.use2", "To generate AI-powered suggestions \u2014 assessment data is transmitted to a third-party AI service for real-time processing and is not retained after the response is delivered")}</li>
                  <li>{tr("privacy.use3", "To maintain your progress and learning history \u2014 processed for the performance of our service to you")}</li>
                  <li>{tr("privacy.use4", "We do not process your data for advertising, profiling, or any purpose beyond career guidance")}</li>
                </ul>
              </section>

              {/* 3 */}
              <section id="minors">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  3. {tr("privacy.minorsTitle", "Data Protection for Minors")}
                </h2>
                <ul className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <li>{tr("privacy.minors1", "We recognize that our users may be under the age of 18. We do not knowingly engage in behavioral tracking or profiling of minors.")}</li>
                  <li>{tr("privacy.minors2", "No personal data of minors is used for commercial or advertising purposes")}</li>
                  <li>{tr("privacy.minors3", "AI-generated content is designed to be educational, age-appropriate, and non-harmful")}</li>
                  <li>{tr("privacy.minors4", "We recommend that users under 18 obtain parental or guardian consent before creating an account")}</li>
                </ul>
              </section>

              {/* 4 */}
              <section id="rights">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  4. {tr("privacy.deletionTitle", "Your Rights")}
                </h2>
                <ul className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <li>{tr("privacy.deletion1", "Right to access: You may request a copy of your personal data at any time")}</li>
                  <li>{tr("privacy.deletion2", "Right to rectification: You may update or correct your stored information")}</li>
                  <li>{tr("privacy.deletion3", "Right to erasure: You may request complete deletion of your account and associated data")}</li>
                </ul>
              </section>

              {/* 5 */}
              <section id="thirdparty">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  5. {tr("privacy.thirdPartyTitle", "Third-Party Data Processors")}
                </h2>
                <ul className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <li>{tr("privacy.thirdParty1", "Authentication and storage provider \u2014 handles account credentials and stores user progress securely")}</li>
                  <li>{tr("privacy.thirdParty2", "AI processing service \u2014 receives assessment responses for real-time career analysis; data is not retained or used for model training")}</li>
                  <li>{tr("privacy.thirdParty3", "Database service \u2014 stores assessment questions only; no personal data is stored here")}</li>
                </ul>
              </section>

              {/* 6 */}
              <section id="contact">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  6. {tr("privacy.contactTitle", "Contact")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>If you have any questions, concerns, or requests regarding this Privacy Policy, or wish to exercise your data rights, you may contact us using the information below:</p>
                  <div className="mt-4 space-y-1">
                    <p className="font-medium text-white">SkillsMatch4U</p>
                    <p>Email: <a href="mailto:contact@skillsmatch4u.com" className="text-purple-400 hover:text-purple-300 underline">contact@skillsmatch4u.com</a></p>
                  </div>
                  <p className="mt-4">We aim to respond to all inquiries within 48 hours.</p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 py-6">
        <div className="w-full px-4 md:px-10">
          <p className="text-body-xs text-gray-600">
            &copy; {new Date().getFullYear()} {t("common.brand")}
          </p>
        </div>
      </footer>
    </div>
  );
}
