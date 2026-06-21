import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
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
}: PageHeaderProps) {
  const { t } = useTranslation();
  return (
    <header
      className={`bg-[#050505] border-b border-purple-900/40 shadow-sm ${
        sticky ? "sticky top-0 z-20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo
              label={brand}
              onClick={onHome}
              className="shrink-0 hidden sm:flex"
            />
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 text-gray-300 hover:bg-purple-900/30 rounded-lg transition-colors shrink-0"
                aria-label={backLabel}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {title && (
              <h1 className="text-lg md:text-xl font-bold text-white truncate">
                {title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user && onDashboard && (
              <Button
                onClick={onDashboard}
                variant="outline"
                className="border-purple-700 text-purple-300 hover:bg-purple-900/30 hover:text-white"
              >
                {t("dashboard.title", { defaultValue: "My Dashboard" })}
              </Button>
            )}
            {user && onSignOut && (
              <Button
                onClick={onSignOut}
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold"
              >
                {t("login.signOut", { defaultValue: "Sign out" })}
              </Button>
            )}
            <LanguageSwitcher />
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
