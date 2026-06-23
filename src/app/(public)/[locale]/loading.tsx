export default function Loading() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="h-[100svh] animate-pulse bg-surface-sunken" />
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-10">
        <div className="h-7 w-52 animate-pulse rounded bg-surface-sunken" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({length: 3}).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-[20px] bg-surface-sunken" />
          ))}
        </div>
      </div>
    </div>
  );
}
