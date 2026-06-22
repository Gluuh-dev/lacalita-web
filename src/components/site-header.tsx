import {getTranslations} from 'next-intl/server';
import HeaderBar from './header-bar';

export default async function SiteHeader() {
  const t = await getTranslations('nav');
  return (
    <HeaderBar labels={{menu: t('menu'), events: t('events'), location: t('location')}} />
  );
}
