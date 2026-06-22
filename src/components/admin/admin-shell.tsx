import AdminSidebar from './admin-sidebar';

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
    <AdminSidebar title={title}>
      {action && <div className="mb-5 flex justify-end">{action}</div>}
      {children}
    </AdminSidebar>
  );
}
