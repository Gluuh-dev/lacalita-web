export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20">
      <div className="mx-auto flex max-w-2xl animate-pulse flex-col gap-4">
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-[26px] bg-[#ece0cd] p-5">
            <div className="flex-1 space-y-2.5">
              <div className="h-3 w-24 rounded-full bg-[#ddc6ae]" />
              <div className="h-6 w-44 rounded bg-[#ddc6ae]" />
              <div className="h-9 w-32 rounded bg-[#ddc6ae]" />
              <div className="h-3 w-24 rounded-full bg-[#ddc6ae]" />
            </div>
            <div className="size-28 shrink-0 rounded-2xl bg-[#ddc6ae]" />
          </div>
        ))}
      </div>
    </main>
  );
}
