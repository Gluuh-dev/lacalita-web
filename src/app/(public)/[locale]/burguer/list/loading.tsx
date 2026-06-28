export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20">
      <div className="mx-auto max-w-md animate-pulse">
        <div className="mb-4 flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-[#ece0cd]" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-28 rounded bg-[#ece0cd]" />
            <div className="h-3 w-24 rounded-full bg-[#ece0cd]" />
          </div>
        </div>
        <div className="mb-5 h-12 rounded-2xl bg-[#ece0cd]" />
        <div className="flex flex-col gap-2.5">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-[76px] rounded-[16px] bg-[#ece0cd]" />
          ))}
        </div>
      </div>
    </main>
  );
}
