import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, LayoutDashboard, LogOut } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Button } from "../ui/button";

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
  return (
    <header
      className={`bg-[#050505] border-b border-purple-900/40 shadow-sm ${
        sticky ? "sticky top-0 z-20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-3 md:py-5">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
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
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-end">
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
                onClick={onSignOut}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold text-xs sm:text-sm px-2 sm:px-4 min-w-[40px] sm:min-w-0"
              >
                <LogOut className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">
                  {t("login.signOut", { defaultValue: "Sign out" })}
                </span>
              </Button>
            )}
            <div className="max-w-[100px] sm:max-w-none shrink-0">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
