export function StoreSkeleton() {
  return (
    <div className="animate-pulse rounded-card border border-gray-100 bg-white shadow-sm">
      <div className="h-32 rounded-t-card bg-gray-200" />
      <div className="p-4 pt-10">
        <div className="flex items-start justify-between">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-4 w-10 rounded bg-gray-200" />
        </div>
        <div className="mt-3 flex gap-3">
          <div className="h-3 w-20 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-3/4 rounded bg-gray-200" />
        </div>
        <div className="mt-3 h-3 w-32 rounded bg-gray-200" />
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="h-3 w-12 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
