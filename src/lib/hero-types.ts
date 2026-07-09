// Tipo + valores por defecto de la portada. Sin dependencias de servidor para
// poder importarlo desde componentes cliente (editor y hero público).

export type HeroFont = 'romance' | 'eight' | 'display' | 'adam' | 'sans';

export type HeroSlide = {
  id: string;
  name: string;
  active: boolean; // si está desactivada no aparece en la web
  media: string;
  mediaType: 'image' | 'video';
  poster?: string;
  darken: number;
  showLogo: boolean; // legado (compat)
  logoVariant: 'none' | 'solo' | 'debajo' | 'derecha' | 'texto';
  logoColor: string; // color libre (hex) o nombre legado (white/cream/brown/ink/orange)
  eyebrow: string;
  eyebrowColor: string;
  eyebrowScale: number;
  eyebrowFont: HeroFont;
  lema: string;
  lemaColor: string;
  lemaScale: number;
  lemaFont: HeroFont;
  bienvenida: string;
  bienvenidaColor: string;
  bienvenidaScale: number;
  bienvenidaFont: HeroFont;
  button: string;
  link: string;
  btnColor: string;
  contentAlign: 'left' | 'center' | 'right';
  heroMode: 'boton' | 'rotulo' | 'agenda' | 'poster';
  // Modo 'poster': cartel de evento (fondo + palmeras + foto del artista + textos).
  // El fondo usa `media`; el rótulo superior usa `eyebrow`.
  posterPhoto?: string; // foto del artista recortada (PNG) que sube el usuario
  posterTitle?: string; // titular grande, ej "MONÓLOGO"
  posterScript?: string; // subtítulo manuscrito, ej "en La Calita"
  posterName?: string; // nombre del artista, ej "Pepe Molina"
  posterDate?: string; // ej "Jueves 23 Julio"
  posterTime?: string; // ej "23:30h"
  posterLoc?: string; // ej "Paseo Marítimo · Salobreña"
  rotulo: string;
  sub: string;
  rotuloY: number;
  rotuloLines: {text: string; color: string; font: HeroFont}[];
  rotuloAuto: boolean; // rellenar con el próximo evento
  font: 'romance' | 'eight' | 'display';
  anim: 'fade' | 'slide' | 'none';
  color: string;
  eventBtn: boolean;
  eventBtnText: string;
  eventBtnLink: string;
  marqueeOn: boolean;
  marquee: string;
  marqueeSpeed: number;
  marqueeColor: string;
  marqueeBg: string;
  marqueeOrient: 'horizontal' | 'vertical';
  marqueeDir: 'left' | 'right' | 'up' | 'down';
  marqueePos: number;
};

export const DEFAULT_HERO_SLIDE: Omit<HeroSlide, 'id'> = {
  name: 'Nueva diapositiva',
  active: true,
  media: '',
  mediaType: 'image',
  darken: 45,
  showLogo: true,
  logoVariant: 'debajo',
  logoColor: 'white',
  eyebrow: '',
  eyebrowColor: '#e9ae74',
  eyebrowScale: 1,
  eyebrowFont: 'adam',
  lema: 'Título de la portada',
  lemaColor: '#ffffff',
  lemaScale: 1,
  lemaFont: 'display',
  bienvenida: '',
  bienvenidaColor: '#ffffff',
  bienvenidaScale: 1,
  bienvenidaFont: 'sans',
  button: 'Ver la carta',
  link: '/carta',
  btnColor: '#e9ae74',
  contentAlign: 'left',
  heroMode: 'boton',
  rotulo: '',
  sub: '',
  rotuloY: 68,
  rotuloLines: [
    {text: '', color: '#e9ae74', font: 'romance'},
    {text: '', color: '#ffffff', font: 'eight'},
    {text: '', color: '#ffffff', font: 'sans'}
  ],
  rotuloAuto: false,
  font: 'romance',
  anim: 'fade',
  color: '#e9ae74',
  eventBtn: false,
  eventBtnText: 'Ir al evento',
  eventBtnLink: '/eventos',
  marqueeOn: false,
  marquee: '',
  marqueeSpeed: 18,
  marqueeColor: '#e9ae74',
  marqueeBg: '',
  marqueeOrient: 'horizontal',
  marqueeDir: 'left',
  marqueePos: 50,
  posterPhoto: '',
  posterTitle: 'MONÓLOGO',
  posterScript: 'en La Calita',
  posterName: 'Nombre del artista',
  posterDate: 'Jueves 23 Julio',
  posterTime: '23:30h',
  posterLoc: 'Paseo Marítimo · Salobreña'
};
