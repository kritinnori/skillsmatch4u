import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { LANGUAGES } from "../i18n/languages";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = i18n.resolvedLanguage || i18n.language || "en";

  const handleChange = (code: string) => {
    void i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-1.5 text-purple-300 hover:bg-purple-900/30 active:bg-purple-900/50 rounded-lg px-1.5 sm:px-2 py-1.5 transition-colors border border-purple-700/60"
        aria-label={t("common.language")}
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
        <span className="text-[11px] sm:text-xs font-semibold text-white uppercase">{current}</span>
        <ChevronDown className={`w-3 h-3 text-purple-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Desktop: Dropdown menu */}
      {isOpen && (
        <>
          {/* Desktop dropdown - hidden on mobile */}
          <div className="hidden sm:block absolute right-0 top-full mt-1 w-48 bg-[#111111] border border-purple-900/60 rounded-lg shadow-xl z-50 py-1 max-h-80 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleChange(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                  current === lang.code
                    ? "bg-purple-700/50 text-white"
                    : "text-gray-300 hover:bg-purple-900/30"
                }`}
              >
                <span className="w-6 text-[10px] font-bold text-purple-400 uppercase">{lang.code}</span>
                <span className="text-sm">{lang.nativeName}</span>
              </button>
            ))}
          </div>

          {/* Mobile: Bottom sheet */}
          <div 
            className="sm:hidden fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Bottom sheet */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-purple-900/60 rounded-t-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 bg-gray-600 rounded-full" />
              </div>
              
              {/* Header */}
              <div className="px-4 py-2 border-b border-purple-900/30">
                <h3 className="text-sm font-semibold text-white text-center">
                  {t("common.selectLanguage", { defaultValue: "Select Language" })}
                </h3>
              </div>
              
              {/* Language grid */}
              <div className="grid grid-cols-3 gap-1 p-2 max-h-[50vh] overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleChange(lang.code)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg transition-colors ${
                      current === lang.code
                        ? "bg-purple-700 text-white"
                        : "text-gray-300 hover:bg-purple-900/30 active:bg-purple-900/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              
              {/* Safe area padding */}
              <div className="h-6" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
