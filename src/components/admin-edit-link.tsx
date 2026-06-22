'use client';

import {useIsAdmin} from '@/lib/use-is-admin';

export default function AdminEditLink({href, label}: {href: string; label: string}) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <a
      href={href}
      className="mt-3 inline-block rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white hover:bg-black"
    >
      ✎ {label}
    </a>
  );
}
