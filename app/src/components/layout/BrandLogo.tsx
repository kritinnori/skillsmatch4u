import { Briefcase } from "lucide-react";

interface BrandLogoProps {
  label: string;
  className?: string;
}

export function BrandLogo({ label, className = "" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800 text-white shadow-sm">
        <Briefcase className="h-5 w-5" aria-hidden />
      </div>
      <span className="text-xl font-bold text-gray-900">{label}</span>
    </div>
  );
}
