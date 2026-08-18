import { useState, useRef, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, LogOut, Menu, X, Sparkles, ChevronDown, FileText } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { AIExplainabilityModal } from "../AIExplainabilityModal";
import { SignOutModal } from "../SignOutModal";

interface PageHeaderProps {
  brand: string;
  onBack?: () => void;
  backLabel?: string;
  title?: string;
  sticky?: boolean;
  children?: ReactNode;
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  onShowOpportunities?: () => void;
  onLoginRequired?: () => void;
}

export function PageHeader({
  brand,
  onBack,
  backLabel = "Go back",
  title,
  sticky = false,
  children,
  user,
  onSignOut,
  onHome,
  onDashboard,
  onShowOpportunities,
}: PageHeaderProps) {
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

  return (
    <header
      className={`bg-[#050505] border-b border-purple-900/40 shadow-sm ${
        sticky ? "sticky top-0 z-20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-2">

          {/* Left: Logo + back + title */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
            <BrandLogo
              label={brand}
              onClick={onHome}
              className="shrink-0"
            />
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors shrink-0"
                style={{ touchAction: "manipulation" }}
                aria-label={backLabel}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {title && (
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                {title}
              </h1>
            )}
          </div>

          {/* Right: Desktop actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* AI badge */}
            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="w-9 h-9 flex items-center justify-center text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors border border-purple-700/60 text-xs font-bold"
              style={{ touchAction: "manipulation" }}
              aria-label={t("ai.title", { defaultValue: "How AI is Used" })}
              title={t("ai.title", { defaultValue: "How AI is Used" })}
            >
              AI
            </button>

            {/* Location/Opportunities - show for signed-in users */}
            {user && onShowOpportunities && (
              <button
                type="button"
                onClick={onShowOpportunities}
                className="w-9 h-9 flex items-center justify-center text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors"
                style={{ touchAction: "manipulation" }}
                aria-label={t("opportunities.title", { defaultValue: "Explore Opportunities Near You" })}
                title={t("opportunities.title", { defaultValue: "Explore Opportunities Near You" })}
              >
                <MapPin className="w-4 h-4" />
              </button>
            )}

            {/* Avatar dropdown for logged-in users */}
            {user && (
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
                    {onDashboard && (
                      <button
                        onClick={() => { onDashboard(); setAvatarMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-200 hover:bg-purple-900/30 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">{t("nav.myCareer", { defaultValue: "My Career" })}</span>
                      </button>
                    )}
                    
                    {onSignOut && (
                      <>
                        <div className="border-t border-purple-900/30 my-1.5" />
                        <button
                          onClick={() => { setShowSignOutConfirm(true); setAvatarMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">{t("login.signOut", { defaultValue: "Sign out" })}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Language switcher */}
            <LanguageSwitcher />
          </div>

          {/* Right: Mobile actions */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
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
        {children}
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-purple-900/30 bg-[#0a0a0a] px-4 py-3 space-y-1">
          {onDashboard && (
            <button
              onClick={() => { onDashboard(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-200 hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">{t("nav.myCareer", { defaultValue: "My Career" })}</span>
            </button>
          )}
          
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

          {onSignOut && (
            <div className="border-t border-purple-900/30 pt-2 mt-2">
              <button
                onClick={() => { setShowSignOutConfirm(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">{t("login.signOut", { defaultValue: "Sign out" })}</span>
              </button>
            </div>
          )}
        </div>
      )}
      {showAIModal && <AIExplainabilityModal onClose={() => setShowAIModal(false)} />}
      {showSignOutConfirm && onSignOut && (
        <SignOutModal
          onConfirm={onSignOut}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}
    </header>
  );
}
