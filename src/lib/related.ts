import type {Category, Product} from '@/lib/queries';

const MAX_RAILS = 2; // dos carruseles como mucho: el pie no es otra carta
const MAX_ITEMS = 8; // y ocho platos por carrusel

// Los más votados primero: como votar = guardar en favoritos, lo que enseñamos
// al pie se mueve solo con lo que de verdad gusta a la gente.
const byVotes = (a: Product, b: Product) => (b.votes ?? 0) - (a.votes ?? 0) || a.position - b.position;

/**
 * Qué enseñar al pie del detalle:
 *  1. Más de lo mismo (su categoría, sin el plato que estás viendo).
 *  2. Una categoría complementaria, que rota según el plato — así dos platos
 *     distintos no proponen lo mismo y la carta se recorre entera con el tiempo.
 *
 * Fuera: las salsas (ya salen arriba con su foto) y los panes/rellenos de
 * "Arma tu tostada", que sueltos no significan nada.
 */
export function relatedFor(cats: Category[], product: Product): Category[] {
  const usable = cats.filter(
    (c) => c.role === 'normal' && (c.products?.length ?? 0) > 0
  );

  const trim = (c: Category): Category | null => {
    const products = (c.products ?? [])
      .filter((p) => p.id !== product.id && p.available !== false)
      .sort(byVotes)
      .slice(0, MAX_ITEMS);
    return products.length ? {...c, products} : null;
  };

  const own = usable.find((c) => c.id === product.category_id);
  const others = usable.filter((c) => c.id !== product.category_id);

  // Rotación estable por producto: mismo plato, misma sugerencia (no baila entre
  // recargas), pero cada plato tira de una categoría distinta.
  const seed = [...product.id].reduce((n, ch) => n + ch.charCodeAt(0), 0);
  const rotated = others.map((_, i) => others[(seed + i) % others.length]);

  return [own, ...rotated]
    .filter((c): c is Category => !!c)
    .map(trim)
    .filter((c): c is Category => !!c)
    .slice(0, MAX_RAILS);
}
