export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20">
      <div className="mx-auto flex max-w-2xl animate-pulse flex-col gap-4">
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="h-36 rounded-[26px] bg-[#ece0cd]" />
        ))}
      </div>
    </main>
  );
}
