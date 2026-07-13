# Prompt · Hoja de iconos de la carta (una sola imagen)

Iconos que necesitamos, todos en la **misma imagen**, fondo blanco puro y trazo negro,
para recortarlos uno a uno y usarlos en los filtros de la carta, en el botón circular
del tab-bar y en la tarjeta de "Hazlo menú".

**Categorías (4):** smash burger · entrantes · chicken wings · salsas
**Menú (3):** hamburguesa · patatas fritas · vaso de refresco

Estilo objetivo: **pictogramas**, no dibujos. Lo mismo que Lucide o Feather (los iconos
que ya usa la web): trazo único y uniforme, formas geométricas simples, la silueta
mínima que hace reconocible cada cosa. Nada de textura, sombreado, semillas de sésamo,
bordes ondulados ni detalles decorativos. Si un rasgo se puede quitar sin que deje de
entenderse el icono, se quita.

El de *smash burger* debe casar con la hamburguesa de línea del botón circular del
tab-bar.

---

## Prompt (pégalo tal cual)

```
A sheet of 8 minimalist pictogram icons on a pure white background (#FFFFFF),
arranged in a 2 x 4 grid, evenly spaced, generous margins.

Style: extreme minimalism, in the style of Lucide / Feather icons. Pure black
(#000000) outline strokes only. One single uniform stroke weight across the whole
sheet (roughly 5% of the icon height), rounded caps, rounded joins. Geometric,
reduced shapes: only the minimum silhouette needed to recognise the object.

Strictly avoid: filled areas, solid black shapes, hatching, texture, shading,
gradients, shadows, outlines of outlines, double lines, perspective, 3/4 views,
decorative details, sesame seeds, wavy or bumpy edges, background shapes, circles
or frames around the icons, text, labels, captions, watermarks.

Every icon: flat front or side view, perfectly centred in its own invisible square
cell, same optical size, drawn as if they all belonged to a single icon font.
Aim for about 6 to 10 strokes per icon, no more.

The icons, in reading order:
1. Burger: three stacked rounded horizontal shapes — a dome for the top bun, one
   straight line for the patty, a flat rounded base for the bottom bun. Nothing else.
2. Starters: a simple flat plate (one shallow curve with a rim line) with two small
   ovals resting on it.
3. Chicken wing: one simple drumstick silhouette — a rounded shape and a straight
   bone with a small knob at the end.
4. Sauce: a small dip bowl — a half-circle bowl with a straight rim line and one
   short curved swirl above it.
5. Burger (meal deal): same as icon 1.
6. Fries: a trapezoid carton with three or four straight sticks poking out of the top.
7. Drink: a straight tapered cup with a lid line on top and one diagonal straw.
8. Leave this cell EMPTY (pure white).

Aspect ratio 4:2, high resolution, crisp vector-like edges, suitable for cutting each
icon out and using it as an SVG.
```

## Si aún salen demasiado detallados

Añade al final del prompt esta línea, que suele ser la que los termina de calmar:

```
Think of each icon as a UI symbol on a mobile app button at 24 x 24 pixels: if a
detail would disappear at that size, do not draw it.
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
