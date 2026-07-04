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

  const sections = [
    { id: "acceptance", num: "1", title: "Acceptance of Terms" },
    { id: "eligibility", num: "2", title: "Eligibility" },
    { id: "account", num: "3", title: "Account Registration" },
    { id: "services", num: "4", title: "Description of Services" },
    { id: "ai-disclaimer", num: "5", title: "AI-Generated Content Disclaimer" },
    { id: "user-conduct", num: "6", title: "User Conduct" },
    { id: "ip", num: "7", title: "Intellectual Property" },
    { id: "third-party", num: "8", title: "Third-Party Links & Services" },
    { id: "limitation", num: "9", title: "Limitation of Liability" },
    { id: "termination", num: "10", title: "Termination" },
    { id: "changes", num: "11", title: "Changes to Terms" },
    { id: "governing-law", num: "12", title: "Governing Law" },
    { id: "contact", num: "13", title: "Contact" },
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
              Terms &amp; Conditions
            </h1>
            <p className="text-body-xs text-gray-500 mb-6">
              Effective: July 2025
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
            {/* Mobile title */}
            <div className="lg:hidden mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                Terms &amp; Conditions
              </h1>
              <p className="text-body-xs text-gray-500">
                Effective: July 2025
              </p>
            </div>

            {/* Intro */}
            <div className="rounded-lg bg-[#111111] border border-purple-900/30 px-4 py-3 mb-8">
              <p className="text-body-xs text-gray-400 italic">
                This document is available in English only. In the event of any conflict between a translated version and the English version, the English version shall prevail.
              </p>
            </div>

            <p className="text-body-sm text-gray-300 leading-relaxed mb-10">
              These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the SkillsMatch4U platform (&quot;Service&quot;), operated by SkillsMatch4U (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you must not use the Service.
            </p>

            <div className="space-y-10">
              {/* 1 */}
              <section id="acceptance">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  1. Acceptance of Terms
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>By creating an account, completing an assessment, or otherwise accessing the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
                  <p>If you are under the age of 18, you represent that your parent or legal guardian has reviewed and consents to these Terms on your behalf.</p>
                </div>
              </section>

              {/* 2 */}
              <section id="eligibility">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  2. Eligibility
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>The Service is designed for students and individuals seeking career guidance. There is no minimum age requirement to access the Service; however, users under the age of 18 are encouraged to use the Service with parental or guardian awareness.</p>
                  <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
                </div>
              </section>

              {/* 3 */}
              <section id="account">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  3. Account Registration
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>Account creation is optional. You may use certain features of the Service without registering. However, to save your assessment results, track progress, and access personalized recommendations, account registration is required.</p>
                  <p>You are solely responsible for all activity that occurs under your account. You agree to notify us immediately of any unauthorized access or use of your account.</p>
                </div>
              </section>

              {/* 4 */}
              <section id="services">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  4. Description of Services
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>SkillsMatch4U provides:</p>
                  <ul className="space-y-2 ml-4">
                    <li>A career assessment quiz that evaluates your interests, aptitudes, and preferences</li>
                    <li>AI-generated career recommendations based on your assessment responses</li>
                    <li>Suggested courses from vocational and online learning platforms</li>
                    <li>Suggested job opportunities relevant to your career match</li>
                    <li>Location-based industry and opportunity discovery (when location is provided voluntarily)</li>
                    <li>A personal dashboard to track your progress</li>
                  </ul>
                  <p>The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We reserve the right to modify, suspend, or discontinue any feature of the Service at any time without prior notice.</p>
                </div>
              </section>

              {/* 5 */}
              <section id="ai-disclaimer">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  5. AI-Generated Content Disclaimer
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>The career recommendations, course suggestions, and job listings provided by the Service are generated by artificial intelligence and are intended for informational and educational purposes only.</p>
                  <p><strong className="text-white">These recommendations do not constitute professional career counseling, employment advice, or any form of guarantee regarding employment outcomes.</strong></p>
                  <p>AI-generated outputs may contain inaccuracies, outdated information, or suggestions that may not be suitable for your specific circumstances. You are solely responsible for evaluating and acting upon any recommendations provided.</p>
                  <p>We do not guarantee the accuracy, completeness, or reliability of any AI-generated content. Course availability, job listings, and salary information are subject to change and should be independently verified.</p>
                </div>
              </section>

              {/* 6 */}
              <section id="user-conduct">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  6. User Conduct
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>You agree not to:</p>
                  <ul className="space-y-2 ml-4">
                    <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
                    <li>Attempt to gain unauthorized access to any part of the Service or its underlying systems</li>
                    <li>Interfere with or disrupt the integrity or performance of the Service</li>
                    <li>Submit false, misleading, or fraudulent information</li>
                    <li>Use automated tools, bots, or scripts to access the Service without our express written permission</li>
                    <li>Reproduce, distribute, or commercially exploit any content from the Service without authorization</li>
                  </ul>
                </div>
              </section>

              {/* 7 */}
              <section id="ip">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  7. Intellectual Property
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>All content, features, and functionality of the Service — including but not limited to text, graphics, logos, software, and the underlying AI models and algorithms — are owned by or licensed to SkillsMatch4U and are protected by applicable intellectual property laws.</p>
                  <p>You retain ownership of any personal data you submit. By using the Service, you grant us a limited, non-exclusive license to process your assessment data solely for the purpose of providing career recommendations to you.</p>
                </div>
              </section>

              {/* 8 */}
              <section id="third-party">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  8. Third-Party Links &amp; Services
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>The Service may contain links to third-party websites, courses, and job listings. These links are provided for your convenience only. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party sites.</p>
                  <p>Your interactions with third-party services are governed solely by the terms and policies of those third parties. We are not liable for any loss or damage arising from your use of third-party services accessed through our platform.</p>
                </div>
              </section>

              {/* 9 */}
              <section id="limitation">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  9. Limitation of Liability
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>To the maximum extent permitted by applicable law, SkillsMatch4U and its affiliates, officers, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.</p>
                  <p>In no event shall our total liability exceed the amount you have paid to us (if any) for access to the Service during the twelve (12) months preceding the claim.</p>
                  <p>We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.</p>
                </div>
              </section>

              {/* 10 */}
              <section id="termination">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  10. Termination
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without prior notice, for conduct that we determine violates these Terms or is harmful to other users, us, or third parties.</p>
                  <p>You may terminate your account at any time by requesting account deletion. Upon termination, your right to access the Service ceases immediately, and we may delete your stored data in accordance with our Privacy Policy.</p>
                </div>
              </section>

              {/* 11 */}
              <section id="changes">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  11. Changes to Terms
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>We reserve the right to update or modify these Terms at any time. Changes will be effective immediately upon posting the revised Terms on the Service. The &quot;Effective&quot; date at the top of this page indicates when the Terms were last revised.</p>
                  <p>Your continued use of the Service after any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.</p>
                </div>
              </section>

              {/* 12 */}
              <section id="governing-law">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  12. Governing Law
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India.</p>
                </div>
              </section>

              {/* 13 */}
              <section id="contact">
                <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-purple-900/30">
                  13. Contact
                </h2>
                <div className="text-body-sm text-gray-300 space-y-3 leading-relaxed">
                  <p>If you have any questions or concerns about these Terms, please contact us at the email address associated with your account registration.</p>
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
