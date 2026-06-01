const Pulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-gray-800 ${className}`} />
);

const CardSkeleton = () => (
  <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 animate-pulse">
    <div className="h-5 w-3/4 bg-gray-800 rounded" />
    <div className="h-3 w-1/3 bg-gray-800 rounded mt-3" />
    <div className="h-3 w-full bg-gray-800 rounded mt-3" />
    <div className="h-3 w-5/6 bg-gray-800 rounded mt-2" />
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
    <div className="space-y-8 py-12" aria-hidden>
      <div className="text-center space-y-2">
        <Pulse className="h-6 w-48 mx-auto" />
        <Pulse className="h-4 w-56 mx-auto" />
      </div>

      <div className="text-center border-b border-gray-800 pb-8 space-y-4">
        <Pulse className="h-12 w-3/4 max-w-md mx-auto" />
        <Pulse className="h-6 w-40 mx-auto" />
      </div>

      <div className="max-w-2xl mx-auto space-y-2">
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-5/6 mx-auto" />
        <Pulse className="h-4 w-4/5 mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <Pulse className="h-3 w-24 mx-auto" />
          <Pulse className="h-5 w-32 mx-auto" />
        </div>
        <div className="text-center space-y-2">
          <Pulse className="h-3 w-24 mx-auto" />
          <Pulse className="h-5 w-32 mx-auto" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-md uppercase tracking-wider text-gray-600 font-semibold text-center">
          {keySkillsLabel}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Pulse key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        <p className="text-md uppercase tracking-wider text-gray-600 font-semibold text-center">
          {coursesTitle}
        </p>
        <div className="grid gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        <p className="text-md uppercase tracking-wider text-gray-600 font-semibold text-center">
          {jobsTitle}
        </p>
        <div className="grid gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
