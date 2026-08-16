export function StoreSkeleton() {
  return (
    <div className="animate-pulse rounded-card border border-paper-200/70 bg-surface shadow-soft">
      <div className="skeleton h-32 rounded-t-card" />
      <div className="p-4 pt-10">
        <div className="flex items-start justify-between">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-4 w-10 rounded" />
        </div>
        <div className="mt-3 flex gap-3">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
        <div className="skeleton mt-3 h-3 w-32 rounded" />
        <div className="mt-4 flex items-center justify-between border-t border-paper-200/70 pt-3">
          <div className="skeleton h-3 w-12 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
