export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] px-5 pb-24 pt-14">
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="aspect-[3/4] max-h-[64svh] w-full rounded-[28px] bg-[#ece0cd]" />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="h-12 flex-1 rounded-full bg-[#ece0cd]" />
          <div className="h-12 flex-1 rounded-full bg-[#ece0cd]" />
        </div>
      </div>
    </main>
  );
}
