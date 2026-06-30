// Contenido editable de la landing (sin dependencias de servidor).
export type I18nText = Record<string, string>;
export type Review = {quote: string; author: string; rating?: number};

export type LandingContent = {
  about?: {title?: I18nText; text?: I18nText; features?: string[]};
  story?: {title?: I18nText; text?: I18nText};
  reviews?: Review[];
  gallery?: string[];
};

export const DEFAULT_CONTENT: Required<LandingContent> = {
  about: {
    title: {es: 'Comer, beber y atardecer frente al mar'},
    text: {
      es: 'Un beach club a pie de playa en Salobreña: desayunos y meriendas, cocina mediterránea de producto y nuestra hamburguesería, con música en directo al caer el sol.'
    },
    features: ['A pie de playa', 'Cocina mediterránea', 'Música en directo']
  },
  story: {
    title: {es: 'Nuestra historia'},
    text: {
      es: 'La Calita nace del amor por el Mediterráneo y por Salobreña. Un rincón frente al mar donde compartir buena comida, atardeceres y música, durante todo el día.'
    }
  },
  reviews: [],
  gallery: []
};
