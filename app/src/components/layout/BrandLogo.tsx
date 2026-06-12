import { Briefcase } from "lucide-react";

interface BrandLogoProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

export function BrandLogo({ label, className = "", onClick }: BrandLogoProps) {
  const content = (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800 text-white shadow-sm">
        <Briefcase className="h-5 w-5" aria-hidden />
      </div>
      <span className="text-xl font-bold text-white">{label}</span>
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
