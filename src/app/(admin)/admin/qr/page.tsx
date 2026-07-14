import {requireUser} from '@/lib/auth';
import {getMenus} from '@/lib/queries';
import {SITE_URL} from '@/lib/site';
import {tx} from '@/lib/localize';
import AdminShell from '@/components/admin/admin-shell';
import QrManager, {type QrTarget} from './qr-manager';

export default async function QrAdmin() {
  await requireUser();
  const menus = await getMenus();

  // El QR de cada carta y uno más que lleva al selector de las cuatro.
  const targets: QrTarget[] = [
    {
      key: 'todas',
      label: 'Las cuatro cartas',
      hint: 'Lleva a la pantalla donde se elige carta. Es el que va en la mesa.',
      url: `${SITE_URL}/es/carta`
    },
    ...menus.map((m) => ({
      key: m.slug,
      label: tx(m.name, 'es'),
      hint: m.slug === 'hamburgueseria' ? 'Carta de la casetilla de burgers.' : 'Entra directo a esta carta.',
      url: m.slug === 'hamburgueseria' ? `${SITE_URL}/es/burguer/carta` : `${SITE_URL}/es/carta/${m.slug}`
    }))
  ];

  return (
    <AdminShell title="Códigos QR">
      <QrManager targets={targets} />
    </AdminShell>
  );
}
