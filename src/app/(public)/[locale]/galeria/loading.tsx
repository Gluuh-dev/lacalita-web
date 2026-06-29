export default function Loading() {
  return (
    <main className="min-h-screen bg-bg pb-28 pt-20">
      <div className="mx-auto max-w-6xl animate-pulse px-4">
        <div className="mx-auto mb-3 h-3 w-24 rounded-full bg-surface-2" />
        <div className="mx-auto mb-10 h-10 w-72 max-w-full rounded bg-surface-2" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="aspect-square rounded-[16px] bg-surface-2" />
          ))}
        </div>
      </div>
    </main>
  );
}
