export default function Loading() {
  return (
    <main className="min-h-screen bg-bg pb-28 pt-20">
      <div className="mx-auto max-w-3xl animate-pulse px-4">
        <div className="mx-auto mb-3 h-3 w-28 rounded-full bg-surface-2" />
        <div className="mx-auto mb-8 h-10 w-80 max-w-full rounded bg-surface-2" />
        <div className="h-72 rounded-[20px] bg-surface-2" />
        <div className="mt-3 h-12 rounded-full bg-surface-2" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-14 rounded-[16px] bg-surface-2" />
          ))}
        </div>
        <div className="mt-4 h-44 rounded-[20px] bg-surface-2" />
      </div>
    </main>
  );
}
