import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { LANGUAGES } from "../i18n/languages";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  const current = i18n.resolvedLanguage || i18n.language || "en";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value);
  };

  return (
    <label
      className={`relative flex items-center gap-1.5 text-body-sm text-gray-700 ${className}`}
      aria-label={t("common.language")}
    >
      <Globe className="w-4 h-4 text-primary-700 pointer-events-none" />
      <select
        value={current}
        onChange={handleChange}
        className="appearance-none bg-white border border-gray-300 rounded-lg pr-8 pl-2 py-1.5 text-gray-900 hover:border-primary-300 focus:outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-100 cursor-pointer text-body-sm"
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, #6b7280 50%), linear-gradient(135deg, #6b7280 50%, transparent 50%)",
          backgroundPosition:
            "calc(100% - 12px) 50%, calc(100% - 7px) 50%",
          backgroundSize: "5px 5px, 5px 5px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
