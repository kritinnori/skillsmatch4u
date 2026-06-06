const Pulse = ({ className }: { className: string }) => (
  <div className={`skeleton-shimmer rounded ${className}`} />
);

const CardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="h-5 w-3/4 skeleton-shimmer rounded" />
    <div className="h-3 w-1/3 skeleton-shimmer rounded mt-3" />
    <div className="h-3 w-full skeleton-shimmer rounded mt-3" />
    <div className="h-3 w-5/6 skeleton-shimmer rounded mt-2" />
  </div>
);

interface ResultsPageSkeletonProps {
  coursesTitle: string;
  jobsTitle: string;
  keySkillsLabel: string;
}

export function ResultsPageSkeleton({
  coursesTitle,
  jobsTitle,
  keySkillsLabel,
}: ResultsPageSkeletonProps) {
  return (
    <div className="space-y-10" aria-hidden>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Pulse className="h-40 w-full rounded-none" />
        <div className="p-8 space-y-4">
          <Pulse className="h-4 w-full max-w-2xl" />
          <Pulse className="h-4 w-5/6 max-w-xl" />
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Pulse className="h-20 w-full rounded-lg" />
            <Pulse className="h-20 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-body-sm font-semibold text-gray-500 uppercase text-center">
          {keySkillsLabel}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Pulse key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-body-sm font-semibold text-gray-700 text-center">
          {coursesTitle}
        </p>
        <div className="grid gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-body-sm font-semibold text-gray-700 text-center">
          {jobsTitle}
        </p>
        <div className="grid gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
