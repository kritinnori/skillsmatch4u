import { Briefcase } from "lucide-react";

interface BrandLogoProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

export function BrandLogo({ label, className = "", onClick }: BrandLogoProps) {
  const content = (
    <>
      <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary-800 text-white shadow-sm shrink-0">
        <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
      </div>
      <span className="text-base sm:text-xl font-bold text-white whitespace-nowrap">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        aria-label="Go to homepage"
      >
        {content}
      </button>
    );
  }

  return <div className={`flex items-center gap-2 ${className}`}>{content}</div>;
}
