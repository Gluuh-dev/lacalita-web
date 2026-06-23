export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-20">
      <div className="aspect-[4/3] w-full animate-pulse rounded-[24px] bg-surface-sunken" />
      <div className="mt-5 space-y-3">
        <div className="h-8 w-2/3 animate-pulse rounded bg-surface-sunken" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-sunken" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-sunken" />
        <div className="h-7 w-24 animate-pulse rounded bg-surface-sunken" />
      </div>
    </main>
  );
}
