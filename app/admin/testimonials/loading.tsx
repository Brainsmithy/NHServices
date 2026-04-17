export default function Loading() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
