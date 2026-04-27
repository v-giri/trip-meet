export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        {/* Header skeleton */}
        <div className="h-10 bg-gray-200 rounded-xl w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
        {/* Content skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
