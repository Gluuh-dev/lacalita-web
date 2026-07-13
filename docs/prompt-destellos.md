# Prompt · Destellos (bokeh) para los fondos

Tres imágenes de **luces fuera de foco** que luego colocamos nosotros donde queramos
(una esquina, detrás de un título, tras una tarjeta…). Por eso **las luces van
agrupadas en el centro de la imagen**, no en los bordes: así podemos recortarlas,
rotarlas y posicionarlas libremente sin que se corten.

Reglas comunes:

- **El grupo de luces va CENTRADO**, como una mancha de bokeh flotando, y los bordes
  de la imagen quedan **vacíos** (solo fondo), para poder situarla donde haga falta.
- **Fondo crema plano** (`#faf5ee`, el mismo de la web) — o fondo transparente si el
  generador lo permite (PNG). Nada de negro: la imagen va sobre fondo claro.
- **Cuadrada** (1:1). Al ser un grupo suelto, la recolocamos y escalamos nosotros.
- Solo luz: ni objetos, ni personas, ni texto, ni marcos, ni marcas de agua.

---

## 1 · Dorado (cartas, platos, historia)

```
A square background image of warm golden bokeh: soft out-of-focus circles of light,
like a string of fairy lights on a beach terrace at sunset, heavily blurred.

The cluster of lights is CENTRED in the frame, floating as a single soft group of
glowing circles of different sizes. The EDGES AND CORNERS of the image are EMPTY —
plain background with no light at all — so the cluster can be repositioned freely.

Background: flat warm cream (#faf5ee) with a very subtle paper grain. The bokeh
circles are amber and champagne gold (#d69658, #e6b478), soft-edged, some bright,
some barely visible, overlapping.

Dreamy, elegant, high-end restaurant feel. Extremely soft, no hard edges, no lens
flare streaks, no rays, no vignette. No objects, no people, no text, no watermark.
```

## 2 · Azul noche (eventos, cócteles)

El mismo prompt, cambiando el párrafo del color por:

```
The bokeh circles are deep sea blue and teal (#2e6e8e, #7fb6c9) with a couple of warm
golden lights among them, like the terrace lights reflected on the water at night.
```

## 3 · Brasa (hamburguesería)

El mismo prompt, cambiando el párrafo del color por:

```
The bokeh circles are ember orange and terracotta (#c36148, #e08a52), like sparks from
a grill drifting out of focus, warm and glowing.
```

---

## Cuando las tengas

Guárdalas en `public/destellos/` como `dorado.webp`, `azul.webp` y `brasa.webp` y
dímelo. Al estar centradas puedo ponerlas donde convenga en cada zona (una arriba a
la izquierda, otra abajo a la derecha, giradas y a distinto tamaño) y que no se repita
el patrón.

Mientras tanto, los destellos están hechos con CSS (gradientes radiales difuminados):
se ven bien y no pesan nada, así que estas imágenes son una mejora, no un requisito.
