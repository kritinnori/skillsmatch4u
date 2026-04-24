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
      className={`relative flex items-center gap-1.5 text-sm text-gray-300 ${className}`}
      aria-label={t("common.language")}
    >
      <Globe className="w-4 h-4 text-gray-500 pointer-events-none" />
      <select
        value={current}
        onChange={handleChange}
        className="appearance-none bg-transparent pr-6 pl-1 py-1 rounded-md border border-gray-800 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/60 cursor-pointer"
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%)",
          backgroundPosition:
            "calc(100% - 12px) 50%, calc(100% - 7px) 50%",
          backgroundSize: "5px 5px, 5px 5px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {LANGUAGES.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="bg-[#0a0a0a] text-white"
          >
            {lang.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
