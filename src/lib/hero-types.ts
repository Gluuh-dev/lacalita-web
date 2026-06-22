// Tipo + valores por defecto de la portada. Sin dependencias de servidor para
// poder importarlo desde componentes cliente (editor y hero público).

export type HeroSlide = {
  id: string;
  name: string;
  media: string;
  mediaType: 'image' | 'video';
  poster?: string;
  darken: number;
  showLogo: boolean;
  logoColor: 'white' | 'cream' | 'brown' | 'ink' | 'orange';
  eyebrow: string;
  lema: string;
  bienvenida: string;
  button: string;
  link: string;
  btnColor: string;
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
  media: '',
  mediaType: 'image',
  darken: 45,
  showLogo: true,
  logoColor: 'white',
  eyebrow: '',
  lema: 'Título de la portada',
  bienvenida: '',
  button: 'Ver la carta',
  link: '/carta',
  btnColor: '#e9ae74',
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
