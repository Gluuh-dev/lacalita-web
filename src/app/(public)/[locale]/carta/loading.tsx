export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-10 pt-24">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-surface-sunken" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-[20px] bg-surface-sunken" />
        ))}
      </div>
    </main>
  );
}
