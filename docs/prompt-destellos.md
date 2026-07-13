# Prompt · Destellos de fondo para las cabeceras de sección

Tres imágenes de **luces fuera de foco (bokeh)** para poner de fondo tras la palabra
gigante grabada (SABORES, EVENTOS, UBICACIÓN…). Cada una en un ambiente distinto,
para que las secciones no se repitan.

Reglas comunes, y esto es lo importante:

- **El centro tiene que quedar vacío**, porque encima va el título. Las luces viven en
  los bordes y las esquinas.
- **Fondo crema plano** (`#faf5ee`, el mismo de la web). Nada de negro ni de degradados
  oscuros: la imagen se coloca sobre el fondo claro y tiene que fundirse sola.
- **Horizontal, muy apaisada** (16:5), porque la cabecera es una banda ancha y baja.
- Nada de objetos reconocibles, texto, personas ni marcas de agua: solo luz.

---

## 1 · Dorado (cartas, platos, historia)

```
A very wide horizontal background image, aspect ratio 16:5, of warm golden bokeh
lights: soft out-of-focus circles of light, like a string of fairy lights on a beach
terrace at sunset, heavily blurred.

The lights cluster ONLY around the edges and corners — top-left, bottom-right — and
the CENTRE OF THE IMAGE IS EMPTY, clean and free of any light, because text will be
placed there.

Background: flat warm cream paper (#faf5ee) with a very subtle paper grain. The bokeh
circles are amber and champagne gold (#d6965 8, #e6b478), soft-edged, of different
sizes, some barely visible.

Dreamy, elegant, high-end restaurant feel. Extremely soft, no hard edges, no lens
flare streaks, no rays. No objects, no people, no text, no watermark, no borders.
```

## 2 · Azul noche (eventos, cócteles)

Igual que el anterior, pero cambiando la línea del color por:

```
The bokeh circles are deep sea blue and teal (#2e6e8e, #7fb6c9) with a couple of warm
golden lights among them, like the terrace lights reflected on the water at night.
```

## 3 · Brasa (hamburguesería)

Igual que el primero, pero:

```
The bokeh circles are ember orange and terracotta (#c36148, #e08a52), like sparks from
a grill drifting out of focus, warm and glowing.
```

---

## Cuando las tengas

Guárdalas en `public/destellos/` como `dorado.webp`, `azul.webp` y `brasa.webp` y
dímelo: la cabecera de sección ya está preparada para llevar un fondo, y solo hay que
pasarle cuál toca en cada zona. Mientras tanto, los destellos están hechos con CSS
(gradientes radiales difuminados), que se ven bien y no pesan nada — así que estas
imágenes son una mejora, no un requisito.
