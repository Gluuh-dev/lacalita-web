export default function EmptyState({text}: {text: string}) {
  return (
    <div className="rounded-[20px] border border-dashed border-line bg-surface-2 px-6 py-12 text-center text-sm text-ink-3">
      {text}
    </div>
  );
}
