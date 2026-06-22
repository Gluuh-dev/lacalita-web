export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 pt-20">
      <div className="mb-6 h-9 w-40 animate-pulse rounded bg-surface-sunken" />
      <div className="space-y-3">
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-[20px] border border-line bg-surface" />
        ))}
      </div>
    </main>
  );
}
