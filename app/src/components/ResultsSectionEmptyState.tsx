import { BookOpen, Briefcase } from "lucide-react";

type SectionKind = "courses" | "jobs";

interface ResultsSectionEmptyStateProps {
  kind: SectionKind;
  title: string;
  description: string;
}

export function ResultsSectionEmptyState({
  kind,
  title,
  description,
}: ResultsSectionEmptyStateProps) {
  const Icon = kind === "jobs" ? Briefcase : BookOpen;
  const iconBgColor = kind === "jobs" ? "bg-emerald-600/15" : "bg-blue-600/15";
  const iconColor = kind === "jobs" ? "text-emerald-400" : "text-blue-400";
  const borderColor = kind === "jobs" ? "border-emerald-900/30" : "border-blue-900/30";

  return (
    <div className={`rounded-xl border ${borderColor} bg-[#0d0d0d] px-6 py-10 text-center`}>
      <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden />
      </div>
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
