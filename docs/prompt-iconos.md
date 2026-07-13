# Prompt · Hoja de iconos de la carta (una sola imagen)

Iconos que necesitamos, todos en la **misma imagen**, fondo blanco puro y trazo negro,
para recortarlos uno a uno y usarlos en los filtros de la carta, en el botón circular
del tab-bar y en la tarjeta de "Hazlo menú".

**Categorías (4):** smash burger · entrantes · chicken wings · salsas
**Menú (3):** hamburguesa · patatas fritas · vaso de refresco

El de *smash burger* debe ser el mismo trazo que ya usamos en el botón circular de la
carta (la hamburguesa de línea), para que todo case.

---

## Prompt (pégalo tal cual)

```
A single flat icon sheet on a pure white background (#FFFFFF), 2 rows x 4 columns,
evenly spaced, generous margins between icons.

Style: minimalist line icons, pure black (#000000) strokes only, uniform stroke
weight (about 6% of the icon height), rounded line caps and rounded joins, no fill,
no color, no gradients, no shadows, no drop shadows, no background shapes, no
circles or frames around the icons, no text, no labels, no captions, no watermarks.
Every icon must be perfectly centred inside its own invisible square cell and drawn
at the same optical size, as if they belonged to the same icon font.

The icons, in reading order:
1. A stacked smash burger seen from the side: bun with sesame seeds on top, one
   thin smashed patty, a slice of cheese with a wavy melting edge, lettuce leaf,
   bottom bun.
2. Starters / sharing plate: a small oval plate with three croquettes on it.
3. Chicken wing: a single drumstick-style chicken wing, side view.
4. Sauce: a small dip pot / ramekin seen at a three-quarter angle with a swirl of
   sauce on top.
5. Burger for the meal deal: a simple side-view burger, same construction as icon 1
   but without the sesame seeds.
6. French fries: an open carton of fries with the fries fanning out of the top.
7. Soft drink: a tall takeaway cup with a lid and a straw, with a horizontal band
   near the bottom.
8. Leave this cell EMPTY (pure white).

Aspect ratio 4:2, high resolution, crisp vector-like edges, suitable for cutting
each icon out and using it as an SVG.
```

## Notas para recortarlos

- Al recortar, deja el mismo margen alrededor de cada icono (un 8-10 % del alto) para
  que todos se vean del mismo tamaño en la web.
- Guárdalos en `public/iconos/` con nombres planos: `smash.svg`, `entrantes.svg`,
  `wings.svg`, `salsas.svg`, `menu-burger.svg`, `menu-patatas.svg`, `menu-bebida.svg`.
- Si el generador solo da PNG, pásalos a SVG (por ejemplo con vectorizer.ai) o guárdalos
  en PNG con fondo transparente: al ser negro puro se pueden recolorear con CSS
  (`filter`) o volver a dibujar como trazo.
- Fondo blanco (no transparente) porque así el trazo negro se recorta limpio; la
  transparencia se hace después.
