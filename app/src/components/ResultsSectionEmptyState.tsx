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
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 border border-primary-100">
        <Icon className="h-5 w-5 text-primary-700" aria-hidden />
      </div>
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-2 text-body-sm text-gray-600 leading-relaxed max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
