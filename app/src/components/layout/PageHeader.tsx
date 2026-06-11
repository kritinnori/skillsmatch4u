import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "../LanguageSwitcher";

interface PageHeaderProps {
  brand: string;
  onBack?: () => void;
  backLabel?: string;
  title?: string;
  sticky?: boolean;
  children?: ReactNode;
}

export function PageHeader({
  brand,
  onBack,
  backLabel = "Go back",
  title,
  sticky = false,
  children,
}: PageHeaderProps) {
  return (
    <header
      className={`bg-[#050505] border-b border-purple-900/40 shadow-sm ${
        sticky ? "sticky top-0 z-20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
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
            {title ? (
              <h1 className="text-lg md:text-xl font-bold text-white truncate">
                {title}
              </h1>
            ) : (
              <BrandLogo label={brand} />
            )}
          </div>
          <LanguageSwitcher />
        </div>
        {children}
      </div>
    </header>
  );
}
