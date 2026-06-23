export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-20">
      <div className="aspect-video w-full animate-pulse rounded-[24px] bg-surface-sunken" />
      <div className="mt-5 space-y-3">
        <div className="h-8 w-1/2 animate-pulse rounded bg-surface-sunken" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-sunken" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-sunken" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-surface-sunken" />
      </div>
    </main>
  );
}
