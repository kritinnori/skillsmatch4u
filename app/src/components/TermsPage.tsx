import { useTranslation } from "react-i18next";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface TermsPageProps {
  onBack: () => void;
  onHome?: () => void;
}

export function TermsPage({ onBack, onHome }: TermsPageProps) {
  const { t } = useTranslation();

  const goHome = onHome || onBack;

  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  const sections = [
    { id: "acceptance", num: "1", titleKey: "terms.s1Title", fallback: "Acceptance of Terms" },
    { id: "eligibility", num: "2", titleKey: "terms.s2Title", fallback: "Eligibility" },
    { id: "account", num: "3", titleKey: "terms.s3Title", fallback: "Account Registration" },
    { id: "services", num: "4", titleKey: "terms.s4Title", fallback: "Description of Services" },
    { id: "ai-disclaimer", num: "5", titleKey: "terms.s5Title", fallback: "AI-Generated Content Disclaimer" },
    { id: "user-conduct", num: "6", titleKey: "terms.s6Title", fallback: "User Conduct" },
    { id: "ip", num: "7", titleKey: "terms.s7Title", fallback: "Intellectual Property" },
    { id: "third-party", num: "8", titleKey: "terms.s8Title", fallback: "Third-Party Links & Services" },
    { id: "limitation", num: "9", titleKey: "terms.s9Title", fallback: "Limitation of Liability" },
    { id: "termination", num: "10", titleKey: "terms.s10Title", fallback: "Termination" },
    { id: "changes", num: "11", titleKey: "terms.s11Title", fallback: "Changes to Terms" },
    { id: "governing-law", num: "12", titleKey: "terms.s12Title", fallback: "Governing Law" },
    { id: "contact", num: "13", titleKey: "terms.s13Title", fallback: "Contact" },
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

          {/* Sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <h1 className="text-2xl font-bold text-white mb-1">
              {tr("terms.title", "Terms & Conditions")}
            </h1>
            <p className="text-body-xs text-gray-500 mb-6">
              {tr("terms.effective", "Effective: July 2025")}
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
                  {s.num}. {tr(s.titleKey, s.fallback)}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="max-w-none">
            {/* Mobile title */}
            <div className="lg:hidden mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                {tr("terms.title", "Terms & Conditions")}
              </h1>
              <p className="text-body-xs text-gray-500">
                {tr("terms.effective", "Effective: July 2025")}
              </p>
            </div>

            <p className="text-body-sm text-gray-300 leading-relaxed mb-10">
              {tr("terms.intro", "These Terms and Conditions (\"Terms\") govern your access to and use of the SkillsMatch4U platform (\"Service\"), operated by SkillsMatch4U (\"we\", \"us\", or \"our\"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you must not use the Service.")}
            </p>

            <div className="space-y-10">
              {/* 1 */}
              <section id="acceptance">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  1. {tr("terms.s1Title", "Acceptance of Terms")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s1p1", "By creating an account, completing an assessment, or otherwise accessing the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.")}</p>
                  <p>{tr("terms.s1p2", "If you are under the age of 18, you represent that your parent or legal guardian has reviewed and consents to these Terms on your behalf.")}</p>
                </div>
              </section>

              {/* 2 */}
              <section id="eligibility">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  2. {tr("terms.s2Title", "Eligibility")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s2p1", "The Service is designed for students and individuals seeking career guidance. There is no minimum age requirement to access the Service; however, users under the age of 18 are encouraged to use the Service with parental or guardian awareness.")}</p>
                  <p>{tr("terms.s2p2", "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.")}</p>
                </div>
              </section>

              {/* 3 */}
              <section id="account">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  3. {tr("terms.s3Title", "Account Registration")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s3p1", "Account creation is optional. You may use certain features of the Service without registering. However, to save your assessment results, track progress, and access personalized recommendations, account registration is required.")}</p>
                  <p>{tr("terms.s3p2", "You are solely responsible for all activity that occurs under your account. You agree to notify us immediately of any unauthorized access or use of your account.")}</p>
                </div>
              </section>

              {/* 4 */}
              <section id="services">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  4. {tr("terms.s4Title", "Description of Services")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s4p1", "SkillsMatch4U provides:")}</p>
                  <ul className="space-y-2 ml-4">
                    <li>{tr("terms.s4l1", "A career assessment quiz that evaluates your interests, aptitudes, and preferences")}</li>
                    <li>{tr("terms.s4l2", "AI-generated career recommendations based on your assessment responses")}</li>
                    <li>{tr("terms.s4l3", "Suggested courses from vocational and online learning platforms")}</li>
                    <li>{tr("terms.s4l4", "Suggested job opportunities relevant to your career match")}</li>
                    <li>{tr("terms.s4l5", "Location-based industry and opportunity discovery (when location is provided voluntarily)")}</li>
                    <li>{tr("terms.s4l6", "A personal dashboard to track your progress")}</li>
                  </ul>
                  <p>{tr("terms.s4p2", "The Service is provided on an \"as is\" and \"as available\" basis. We reserve the right to modify, suspend, or discontinue any feature of the Service at any time without prior notice.")}</p>
                </div>
              </section>

              {/* 5 */}
              <section id="ai-disclaimer">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  5. {tr("terms.s5Title", "AI-Generated Content Disclaimer")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s5p1", "The career recommendations, course suggestions, and job listings provided by the Service are generated by artificial intelligence and are intended for informational and educational purposes only.")}</p>
                  <p><strong className="text-white">{tr("terms.s5p2", "These recommendations do not constitute professional career counseling, employment advice, or any form of guarantee regarding employment outcomes.")}</strong></p>
                  <p>{tr("terms.s5p3", "AI-generated outputs may contain inaccuracies, outdated information, or suggestions that may not be suitable for your specific circumstances. You are solely responsible for evaluating and acting upon any recommendations provided.")}</p>
                  <p>{tr("terms.s5p4", "We do not guarantee the accuracy, completeness, or reliability of any AI-generated content. Course availability, job listings, and salary information are subject to change and should be independently verified.")}</p>
                </div>
              </section>

              {/* 6 */}
              <section id="user-conduct">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  6. {tr("terms.s6Title", "User Conduct")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s6p1", "You agree not to:")}</p>
                  <ul className="space-y-2 ml-4">
                    <li>{tr("terms.s6l1", "Use the Service for any unlawful purpose or in violation of any applicable laws")}</li>
                    <li>{tr("terms.s6l2", "Attempt to gain unauthorized access to any part of the Service or its underlying systems")}</li>
                    <li>{tr("terms.s6l3", "Interfere with or disrupt the integrity or performance of the Service")}</li>
                    <li>{tr("terms.s6l4", "Submit false, misleading, or fraudulent information")}</li>
                    <li>{tr("terms.s6l5", "Use automated tools, bots, or scripts to access the Service without our express written permission")}</li>
                    <li>{tr("terms.s6l6", "Reproduce, distribute, or commercially exploit any content from the Service without authorization")}</li>
                  </ul>
                </div>
              </section>

              {/* 7 */}
              <section id="ip">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  7. {tr("terms.s7Title", "Intellectual Property")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s7p1", "All content, features, and functionality of the Service — including but not limited to text, graphics, logos, software, and the underlying AI models and algorithms — are owned by or licensed to SkillsMatch4U and are protected by applicable intellectual property laws.")}</p>
                  <p>{tr("terms.s7p2", "You retain ownership of any personal data you submit. By using the Service, you grant us a limited, non-exclusive license to process your assessment data solely for the purpose of providing career recommendations to you.")}</p>
                </div>
              </section>

              {/* 8 */}
              <section id="third-party">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  8. {tr("terms.s8Title", "Third-Party Links & Services")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s8p1", "The Service may contain links to third-party websites, courses, and job listings. These links are provided for your convenience only. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party sites.")}</p>
                  <p>{tr("terms.s8p2", "Your interactions with third-party services are governed solely by the terms and policies of those third parties. We are not liable for any loss or damage arising from your use of third-party services accessed through our platform.")}</p>
                </div>
              </section>

              {/* 9 */}
              <section id="limitation">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  9. {tr("terms.s9Title", "Limitation of Liability")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s9p1", "To the maximum extent permitted by applicable law, SkillsMatch4U and its affiliates, officers, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.")}</p>
                  <p>{tr("terms.s9p2", "In no event shall our total liability exceed the amount you have paid to us (if any) for access to the Service during the twelve (12) months preceding the claim.")}</p>
                  <p>{tr("terms.s9p3", "We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.")}</p>
                </div>
              </section>

              {/* 10 */}
              <section id="termination">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  10. {tr("terms.s10Title", "Termination")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s10p1", "We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without prior notice, for conduct that we determine violates these Terms or is harmful to other users, us, or third parties.")}</p>
                  <p>{tr("terms.s10p2", "You may terminate your account at any time by requesting account deletion. Upon termination, your right to access the Service ceases immediately, and we may delete your stored data in accordance with our Privacy Policy.")}</p>
                </div>
              </section>

              {/* 11 */}
              <section id="changes">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  11. {tr("terms.s11Title", "Changes to Terms")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s11p1", "We reserve the right to update or modify these Terms at any time. Changes will be effective immediately upon posting the revised Terms on the Service. The \"Effective\" date at the top of this page indicates when the Terms were last revised.")}</p>
                  <p>{tr("terms.s11p2", "Your continued use of the Service after any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.")}</p>
                </div>
              </section>

              {/* 12 */}
              <section id="governing-law">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  12. {tr("terms.s12Title", "Governing Law")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s12p1", "These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India.")}</p>
                </div>
              </section>

              {/* 13 */}
              <section id="contact">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  13. {tr("terms.s13Title", "Contact")}
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>{tr("terms.s13p1", "If you have any questions, concerns, or requests regarding these Terms, you may contact us using the information below:")}</p>
                  <div className="mt-4 space-y-1">
                    <p className="font-medium text-white">SkillsMatch4U</p>
                    <p>Email: <a href="mailto:contact@skillsmatch4u.com" className="text-purple-400 hover:text-purple-300 underline">contact@skillsmatch4u.com</a></p>
                  </div>
                  <p className="mt-4">{tr("terms.s13p2", "We aim to respond to all inquiries within 48 hours.")}</p>
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
