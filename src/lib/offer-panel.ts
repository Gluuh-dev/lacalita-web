// Gradiente de cada oferta según su color_style. Compartido por la lista/carrusel y el
// detalle, para que la card tenga el MISMO color antes y después de abrirla.
export const OFFER_PANELS: Record<string, string> = {
  orange: 'radial-gradient(120% 120% at 80% 0%, #d67a63, #c36148 52%, #a8503a 100%)',
  gold: 'radial-gradient(120% 120% at 80% 0%, #e0a08a, #d67a63 50%, #c36148 100%)',
  dark: 'linear-gradient(135deg, #2a1713 0%, #5a2b22 55%, #a8503a 100%)'
};

export function offerPanel(colorStyle?: string | null) {
  return OFFER_PANELS[colorStyle ?? 'orange'] ?? OFFER_PANELS.orange;
}
