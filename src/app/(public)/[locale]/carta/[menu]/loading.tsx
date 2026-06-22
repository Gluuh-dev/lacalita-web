export default function Loading() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-brand/10 px-6 pb-10 pt-24 text-center">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-surface-sunken" />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-5 flex gap-2">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-surface-sunken" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[20px] border border-line bg-surface">
              <div className="aspect-[4/3] animate-pulse bg-surface-sunken" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-surface-sunken" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-sunken" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
