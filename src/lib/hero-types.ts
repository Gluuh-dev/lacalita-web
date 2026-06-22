// Tipo + valores por defecto de la portada. Sin dependencias de servidor para
// poder importarlo desde componentes cliente (editor y hero público).

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
  lema: string;
  lemaColor: string;
  lemaScale: number;
  bienvenida: string;
  bienvenidaColor: string;
  bienvenidaScale: number;
  button: string;
  link: string;
  btnColor: string;
  contentAlign: 'left' | 'center' | 'right';
  heroMode: 'boton' | 'rotulo' | 'agenda';
  rotulo: string;
  sub: string;
  rotuloY: number;
  font: 'romance' | 'eight' | 'display';
  anim: 'fade' | 'slide' | 'none';
  color: string;
  eventBtn: boolean;
  eventBtnText: string;
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
  lema: 'Título de la portada',
  lemaColor: '#ffffff',
  lemaScale: 1,
  bienvenida: '',
  bienvenidaColor: '#ffffff',
  bienvenidaScale: 1,
  button: 'Ver la carta',
  link: '/carta',
  btnColor: '#e9ae74',
  contentAlign: 'left',
  heroMode: 'boton',
  rotulo: '',
  sub: '',
  rotuloY: 68,
  font: 'romance',
  anim: 'fade',
  color: '#e9ae74',
  eventBtn: false,
  eventBtnText: 'Ir al evento',
  marqueeOn: false,
  marquee: '',
  marqueeSpeed: 18,
  marqueeColor: '#e9ae74',
  marqueeBg: '',
  marqueeOrient: 'horizontal',
  marqueeDir: 'left',
  marqueePos: 50
};
