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

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 bg-gray-900/80">
        <Icon className="h-5 w-5 text-gray-500" aria-hidden />
      </div>
      <p className="text-base font-medium text-gray-300">{title}</p>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
