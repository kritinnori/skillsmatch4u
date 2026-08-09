import { useTranslation } from "react-i18next";

export function ResultsPageSkeleton() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-24" aria-hidden>
      {/* Spinner */}
      <div className="w-10 h-10 border-3 border-purple-900/40 border-t-purple-500 rounded-full animate-spin mb-6" />
      
      {/* Loading text */}
      <p className="text-base text-gray-400">
        {t("results.analyzing", { defaultValue: "Analyzing your responses..." })}
      </p>
    </div>
  );
}
