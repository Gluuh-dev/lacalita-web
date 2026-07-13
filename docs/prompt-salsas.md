# Prompt para generar los tarros de salsa (La Calita Burger)

Genera **una imagen por salsa**. Todas deben salir con el mismo encuadre, la misma
luz y el mismo tamaño de tarro para que el carrusel quede alineado.

## Reglas que NO se pueden saltar

- **Fondo verde croma plano** (`#00B140`), sin degradados ni textura.
- **Sin sombra exterior**, sin reflejo en el suelo, sin viñeta: el tarro debe poder
  recortarse limpio. La sombra *dentro* del tarro (la que da volumen a la salsa) sí.
- **El tarro no toca los bordes**: deja aire alrededor.
- **Nada de texto, etiquetas, marcas ni cucharas.**
- Formato **cuadrado 1:1**, mínimo 1024×1024.

## Prompt base (copia y pega, cambiando solo la línea SAUCE)

```
Professional food product photography of a single small round dipping sauce cup,
seen from a slight three-quarter top-down angle (about 30 degrees).

The cup is a glossy dark plastic ramekin, perfectly round, filled to the top with a
thick swirl of sauce piped in a soft spiral peak, like a dollop of mayonnaise.

SAUCE: <<AQUÍ EL COLOR Y TEXTURA DE CADA SALSA — ver lista abajo>>

Lighting: soft, even studio light from above. Rich highlights on the swirl so the
sauce looks creamy and appetizing, with gentle shading inside the cup to give volume.

CRITICAL: flat pure chroma-key green background (#00B140), completely uniform.
NO drop shadow, NO cast shadow on the floor, NO reflection, NO vignette, NO gradient
— the cup must be cleanly cut out from the background. The cup floats centered with
empty margin around it, not touching the edges.

No text, no labels, no branding, no spoon, no garnish, no hands.
Square 1:1 composition, centered, sharp focus, high detail, 4k.
```

## Línea `SAUCE:` de cada una (9 salsas)

| Salsa | Línea a pegar en `SAUCE:` |
|---|---|
| **Salsa Calita** | a creamy peachy-orange sauce, smooth and glossy, like a light spicy mayo |
| **Mayo Kimchi** | a vivid orange-red creamy sauce with tiny flecks of chili, spicy kimchi mayo |
| **Curry Mango** | a bright golden-yellow sauce, smooth and rich, mango curry |
| **Ranchera** | an off-white creamy ranch sauce with tiny green herb flecks |
| **Stacker** | a bright tomato-red glossy sauce, smooth burger sauce |
| **Click Calita** | a pale peach-orange creamy sauce, silky and smooth |
| **Cream Cheddar** | a warm cheddar-orange molten cheese sauce, thick and glossy |
| **Mayo Trufada** | an ivory cream sauce with fine dark black truffle specks scattered through it |
| **Salsa Ron Pálido** | a coral-red glossy sauce with a warm amber tint |

## Después de generarlas

1. Quita el fondo verde (remove.bg, Photoshop, o `Fondo transparente` en Canva).
2. Exporta a **PNG con transparencia**, cuadrado.
3. Súbelas en `/admin/productos` → carta *Hamburguesería* → cada salsa → *Imagen*.

En cuanto una salsa tenga imagen, aparece sola en el carrusel de la carta.
