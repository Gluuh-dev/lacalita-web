// Skeleton de la carta de hamburguesería.
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pt-24">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mx-auto mb-2 h-3 w-32 rounded-full bg-[#ece0cd]" />
        <div className="mx-auto mb-7 h-9 w-56 rounded-lg bg-[#ece0cd]" />
        <div className="mb-8 flex justify-center gap-2.5 overflow-hidden">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-10 w-28 shrink-0 rounded-full bg-[#ece0cd]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="h-44 rounded-[20px] bg-[#ece0cd]" />
          ))}
        </div>
      </div>
    </main>
  );
}
