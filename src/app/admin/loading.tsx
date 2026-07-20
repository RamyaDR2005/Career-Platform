export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-zinc-800 rounded-md"></div>
        <div className="h-4 w-72 bg-zinc-800 rounded-md"></div>
      </div>

      {/* Grid Stat Cards Skeleton */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-zinc-800 rounded-md"></div>
              <div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
            </div>
            <div className="h-8 w-16 bg-zinc-800 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Recent Activity Sections Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, colIndex) => (
          <div key={colIndex} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="h-5 w-32 bg-zinc-800 rounded-md"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-24 bg-zinc-800 rounded-md"></div>
                    <div className="h-3 w-32 bg-zinc-800 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
