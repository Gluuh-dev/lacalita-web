import {setRequestLocale} from 'next-intl/server';
import {getMenu, getAllergens, getBurgerSlides, getBurgerOffers} from '@/lib/queries';
import {pageMeta} from '@/lib/site';
import BurgerLanding from '@/components/burger/burger-landing';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return {
    keywords: ['hamburguesería Salobreña', 'smash burger Granada', 'La Calita Burger', 'hamburguesas a pie de playa'],
    // Sin images: hereda el opengraph-image del sitio. El SVG que había aquí no
    // lo renderizan ni WhatsApp ni Facebook: la vista previa salía rota.
    ...pageMeta({
      title: 'La Calita Burger · Smash burgers a pie de playa en Salobreña',
      description:
        'Hamburguesería La Calita en Salobreña (Granada): smash burgers de carne fresca y pan brioche, ofertas y las favoritas de la gente. A pie de playa.',
      path: '/burguer',
      locale
    })
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [menu, allergens, slides, offers] = await Promise.all([getMenu('hamburgueseria'), getAllergens(), getBurgerSlides(), getBurgerOffers()]);
  return <BurgerLanding menu={menu} allergens={allergens} slides={slides} offers={offers} locale={locale} />;
}
