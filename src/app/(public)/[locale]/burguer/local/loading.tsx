export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20">
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="mb-6 flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-[#ece0cd]" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-44 rounded bg-[#ece0cd]" />
            <div className="h-3 w-32 rounded-full bg-[#ece0cd]" />
          </div>
        </div>
        <div className="h-64 rounded-[22px] bg-[#ece0cd]" />
        <div className="mt-3 h-12 rounded-full bg-[#ece0cd]" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-14 rounded-[16px] bg-[#ece0cd]" />
          ))}
        </div>
        <div className="mt-4 h-48 rounded-[22px] bg-[#ece0cd]" />
      </div>
    </main>
  );
}
