# 01 — Concepto y marca

## El sitio

**La Calita Beach Club.** Restaurante + cafetería + hamburguesería junto al mar.
Lema: *"Donde el mar acompaña cada desayuno"*.

El cliente llega físicamente, escanea un **QR** en la mesa y ve la carta en su móvil.
La web es además la presencia online del local: landing informativa, agenda de
eventos (DJs, conciertos), y vitrina de las cartas.

## Logos (assets)

En `C:\Users\pvenegas\Documents\lacalita\SVG\`:

| Archivo | Uso previsto |
|---------|--------------|
| `logo-solo.svg` | Favicon, icono PWA, header compacto |
| `logo-texto-debajo.svg` | Hero / splash, vertical |
| `logo-texto-derecha.svg` | Header horizontal |
| `texto-lacalita-derecha.svg` | Solo texto, marca |
| `texto-la-encim-de-calita.svg` | Variante texto |

> Acción al empezar: copiar a `public/brand/` y generar el set de iconos PWA desde
> `logo-solo.svg`.

## Color de marca

- Principal: **`#e9ae74`** (arena dorada). Flexible — podemos usar variantes.
- La paleta completa se define en `05-diseno-y-animaciones.md`.

## Las dos identidades (clave del proyecto)

La hamburguesería **no** comparte el estilo del restaurante. Son dos mundos:

### A) La Calita — restaurante / desayunos
- **Sensación:** playa premium, mediterráneo, tranquilo, elegante.
- **Color:** arena/beige `#e9ae74`, crema, azul mar profundo de acento.
- **Tipografía:** serif elegante para títulos (estilo "LA CALITA BEACH CLUB"),
  sans limpia para cuerpo.
- **Refs:** la carta de desayunos actual, Studio Incubator, Asia Soup, Drinko.
- **Movimiento:** suave, ingredientes/hojas flotando lento, parallax sutil.

### B) Hamburguesería
- **Sensación:** energía, apetito, juvenil, callejero pero limpio.
- **Color:** naranja/rojo vivo, fondo crema `#FCFAF8`, texto casi negro `#140F1F`,
  acento amarillo (`#FEDB71`) opcional.
- **Tipografía:** sans grande y rotunda, mucho peso (estilo Burger King ref).
- **Refs:** Burger King menu, food app rojo, burger naranja.
- **Movimiento:** rápido, rebotes, hover marcado, transiciones con punch.

> La web detecta en qué carta estás y cambia tema (colores, tipografía, ritmo de
> animación) por completo. Mismo sitio, dos pieles.

## Tono de los textos

- ES por defecto, cercano y mediterráneo. Nada corporativo.
- EN y FR generados/auto y revisables.
