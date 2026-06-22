import AdminNav from './admin-nav';

export default function AdminShell({
  title,
  action,
  children
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </>
  );
}
