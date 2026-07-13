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

---

# OPCIÓN RÁPIDA: las 9 salsas en UNA sola imagen

Genera una lámina con las nueve y las recortas de una tacada. Ojo: los
generadores a veces se despistan con nueve colores distintos —revisa que cada
tarro tenga el color correcto y, si se lía, tira del prompt individual de arriba
para la que salga mal.

```
Professional food product photography: a flat lay sheet of NINE separate round
dipping sauce cups, arranged in a clean 3x3 grid with generous empty space
between them (they never touch or overlap).

All nine cups are identical: small glossy dark plastic ramekins, perfectly round,
seen from the exact same slight top-down angle, each filled to the top with a thick
swirl of sauce piped in a soft spiral peak. Same size, same angle, same lighting
for all nine — only the sauce colour changes.

The nine sauces, reading left to right, top row first:
1. creamy peachy-orange sauce, smooth and glossy (spicy mayo)
2. vivid orange-red creamy sauce with tiny chili flecks (kimchi mayo)
3. bright golden-yellow smooth sauce (mango curry)
4. off-white creamy ranch sauce with tiny green herb flecks
5. bright tomato-red glossy smooth sauce
6. pale peach-orange silky creamy sauce
7. warm cheddar-orange molten cheese sauce, thick and glossy
8. ivory cream sauce with fine dark black truffle specks
9. coral-red glossy sauce with a warm amber tint

Lighting: soft, even studio light from above, identical on every cup. Rich
highlights on each swirl so the sauces look creamy and appetizing, with gentle
shading INSIDE each cup to give volume.

CRITICAL: flat pure chroma-key green background (#00B140), completely uniform
across the whole image. NO drop shadows, NO cast shadows on the floor, NO
reflections, NO vignette, NO gradient — every cup must be cleanly cut out from the
background. Wide margin around the grid and clear separation between cups.

No text, no labels, no numbers, no branding, no spoons, no garnish, no hands.
Square 1:1 composition, top-down flat lay, sharp focus, high detail, 4k.
```

**Truco si se lía con los nueve colores**: pídelo en dos tandas con el mismo
prompt — una de 5 (fila de arriba de la carta) y otra de 4 (fila de abajo),
cambiando la lista y el grid a `5 cups in a row` / `4 cups in a row`.

---

## Después de generarlas

1. Quita el fondo verde (remove.bg, Photoshop, o `Fondo transparente` en Canva).
2. Exporta a **PNG con transparencia**, cuadrado.
3. Súbelas en `/admin/productos` → carta *Hamburguesería* → cada salsa → *Imagen*.

En cuanto una salsa tenga imagen, aparece sola en el carrusel de la carta.
