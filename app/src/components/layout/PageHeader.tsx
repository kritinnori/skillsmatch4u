import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Button } from "../ui/button";
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
  onLoginRequired,
}: PageHeaderProps) {
  const { t } = useTranslation();
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  return (
    <header
      className={`bg-[#050505] border-b border-purple-900/40 shadow-sm ${
        sticky ? "sticky top-0 z-20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-3 md:py-5">
        <div className="flex flex-nowrap items-center justify-between gap-1 sm:gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <BrandLogo
              label={brand}
              onClick={onHome}
              className="shrink-0 hidden sm:flex"
            />
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1.5 sm:p-2 text-gray-300 hover:bg-purple-900/30 rounded-lg transition-colors shrink-0"
                aria-label={backLabel}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            {title && (
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white truncate">
                {title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-3 flex-nowrap justify-end shrink-0">
            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 flex items-center justify-center px-1.5 sm:px-2 py-1 text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors shrink-0 border border-purple-700/60 text-xs font-bold"
              style={{ touchAction: "manipulation" }}
              aria-label={t("ai.title", { defaultValue: "How AI is Used" })}
              title={t("ai.title", { defaultValue: "How AI is Used" })}
            >
              AI
            </button>
            {onShowOpportunities && (
              <button
                type="button"
                onClick={() => {
                  if (!user && onLoginRequired) {
                    onLoginRequired();
                  } else {
                    onShowOpportunities();
                  }
                }}
                className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 flex items-center justify-center p-1.5 sm:p-2 text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors shrink-0" style={{ touchAction: "manipulation" }}
                aria-label={t("opportunities.title", { defaultValue: "Explore Opportunities Near You" })}
                title={t("opportunities.title", { defaultValue: "Explore Opportunities Near You" })}
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            {user && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("sm4u:openProfile"))}
                className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 flex items-center justify-center p-1.5 sm:p-2 text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg transition-colors shrink-0"
                style={{ touchAction: "manipulation" }}
                aria-label={t("profile.title", { defaultValue: "My Profile" })}
                title={t("profile.title", { defaultValue: "My Profile" })}
              >
                <UserCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            {user && onDashboard && (
              <Button
                onClick={onDashboard}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold text-xs sm:text-sm px-2 sm:px-4 min-w-[40px] sm:min-w-0"
              >
                <LayoutDashboard className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">
                  {t("dashboard.title", { defaultValue: "My Dashboard" })}
                </span>
              </Button>
            )}
            {user && onSignOut && (
              <Button
                onClick={() => setShowSignOutConfirm(true)}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold text-xs sm:text-sm px-2 sm:px-4 min-w-[40px] sm:min-w-0"
              >
                <LogOut className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">
                  {t("login.signOut", { defaultValue: "Sign out" })}
                </span>
              </Button>
            )}
            <div
              className="max-w-[70px] sm:max-w-none shrink-0 cursor-pointer"
              onClick={(e) => {
                // Clicking anywhere in this wrapper (including a decorative globe
                // icon rendered by LanguageSwitcher) opens the language <select>,
                // since browsers only open a <select> from a direct click on it.
                const target = e.target as HTMLElement;
                if (target.tagName.toLowerCase() === "select") return; // already handled natively
                const select = e.currentTarget.querySelector("select");
                select?.focus();
                select?.click();
              }}
            >
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        {children}
      </div>
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
