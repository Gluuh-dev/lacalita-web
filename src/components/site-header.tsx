import {getTranslations} from 'next-intl/server';
import HeaderBar from './header-bar';

export default async function SiteHeader() {
  const t = await getTranslations('nav');
  return (
    <HeaderBar
      labels={{
        home: t('home'),
        menu: t('menu'),
        events: t('events'),
        gallery: t('gallery'),
        location: t('location'),
        breakfast: t('breakfast'),
        restaurant: t('restaurant'),
        cocktails: t('cocktails'),
        burger: t('burger'),
        editMenu: t('editMenu'),
        admin: t('admin'),
        openMenu: t('openMenu'),
        closeMenu: t('closeMenu')
      }}
    />
  );
}
