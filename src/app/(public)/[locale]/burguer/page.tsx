import {setRequestLocale} from 'next-intl/server';
import {getMenu, getAllergens, getBurgerSlides, getBurgerOffers} from '@/lib/queries';
import {altLanguages} from '@/lib/site';
import BurgerLanding from '@/components/burger/burger-landing';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  await params;
  return {
    title: 'La Calita Burger · Smash burgers a pie de playa en Salobreña',
    description: 'Hamburguesería La Calita en Salobreña (Granada): smash burgers de carne fresca y pan brioche, ofertas y las favoritas de la gente. A pie de playa.',
    keywords: ['hamburguesería Salobreña', 'smash burger Granada', 'La Calita Burger', 'hamburguesas a pie de playa'],
    alternates: altLanguages('/burguer'),
    openGraph: {
      title: 'La Calita Burger',
      description: 'Smash burgers a pie de playa en Salobreña.',
      url: '/burguer',
      images: ['/icon.svg']
    }
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [menu, allergens, slides, offers] = await Promise.all([getMenu('hamburgueseria'), getAllergens(), getBurgerSlides(), getBurgerOffers()]);
  return <BurgerLanding menu={menu} allergens={allergens} slides={slides} offers={offers} locale={locale} />;
}
