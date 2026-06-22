import {setRequestLocale} from 'next-intl/server';
import {getMenu, getAllergens, getBurgerSlides, getBurgerOffers} from '@/lib/queries';
import {altLanguages} from '@/lib/site';
import BurgerLanding from '@/components/burger/burger-landing';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  await params;
  return {
    title: 'La Calita Burger · Smash Burgers a pie de playa',
    description: 'Hamburguesería La Calita en Salobreña: smash burgers, ofertas y las favoritas de la gente.',
    alternates: altLanguages('/hamburgueseria')
  };
}

export default async function HamburgueseriaPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [menu, allergens, slides, offers] = await Promise.all([getMenu('hamburgueseria'), getAllergens(), getBurgerSlides(), getBurgerOffers()]);
  return <BurgerLanding menu={menu} allergens={allergens} slides={slides} offers={offers} locale={locale} />;
}
