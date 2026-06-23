# La Calita — Mejoras de diseño y UX

_Análisis de navegación, header, admin responsive, productos, y patrones de carta/ofertas inspirados en McDonald's / Burger King._
_Complementa `MEJORAS.md` (rendimiento/móvil). Junio 2026._

Prioridad: **P0** ahora · **P1** importante · **P2** roadmap.

---

## 1. Navegación y header

### 1.1 Volver al landing desde la carta de la hamburguesería (P0)
- **Problema:** al entrar en `/carta/hamburgueseria` no hay una forma clara y consistente de volver a la landing `/hamburgueseria`.
- **Acción:** botón fijo en el navbar (flecha/logo) que **siempre lleva a la landing de la sección en la que estás** (burger → `/hamburgueseria`, restaurante → `/`). El "volver" del navegador y este botón deben coincidir.
- **Dónde:** `src/components/burger/burger-header.tsx`, `src/components/header-bar.tsx`, `src/components/hide-on-burger.tsx` (la lógica que decide qué header se muestra).

### 1.2 Selector de idioma igual en TODAS las páginas (P0)
- **Problema:** el cambio de idioma no es un único componente consistente en todas las vistas (público, carta, hamburguesería).
- **Acción:** un **único componente `LangSwitcher`** colocado en el navbar de los dos headers (restaurante y burger) y en la carta. Cambia `es/en/fr` manteniendo la ruta actual (`usePathname` + `next-intl` router.replace con el nuevo locale). Mismo sitio, mismo aspecto en todas.
- **Dónde:** nuevo `src/components/lang-switcher.tsx`; usarlo en `header-bar.tsx` y `burger-header.tsx`.

### 1.3 Header móvil con animación al aparecer (P1)
- **Acción:**
  - **Entrada:** al montar, el header hace slide-down + fade (animación de aparición).
  - **Al hacer scroll:** **se oculta al bajar y reaparece al subir** (patrón "hide-on-scroll-down / show-on-scroll-up"), con transición suave. Fondo sólido cuando `scrollY > 40` (ya existe en burger).
- **Dónde:** `header-bar.tsx`, `burger-header.tsx`. Hook compartido `useHideOnScroll()` (compara scrollY anterior/actual).

---

## 2. Admin responsive: móvil / tablet / PC (P1)

- **Objetivo:** que todo lo que se edita en el admin se pueda **previsualizar y ajustar en 3 tamaños: móvil, tablet y PC**, y que el propio panel sea cómodo de usar desde el móvil.
- **Estado:** la previsualización del hero ya es **PC/Móvil**; falta **tablet** y extenderlo a todas las vistas con preview.
- **Acción:**
  - Toggle de 3 anchos en las previsualizaciones (`390` móvil · `820` tablet · `1440` PC) con su `transform: scale`.
  - Enlazar con la config independiente por tamaño (ver `MEJORAS.md` §P1 heroes; idealmente móvil/tablet/PC).
  - Panel admin usable en móvil: tablas con scroll horizontal o tarjetas apiladas, formularios en una columna, botones grandes.
- **Dónde:** `burger-hero-preview.tsx` (añadir tablet), `admin/hero/[id]`, `admin/hamburgueseria/hero/[id]`, tablas de `admin/productos`.

---

## 3. Productos: foto siempre, vídeo opcional (P0/P1)

- **Problema:** hoy si un producto no tiene imagen se muestra una inicial/icono. Se quiere **foto obligatoria**; vídeo opcional.
- **Acción:**
  - En el **formulario de producto**: hacer la **imagen obligatoria** (validación: no guardar sin foto) y el **vídeo opcional**.
  - En las cartas: si hay vídeo, mostrarlo (ya soportado); si no, la foto. Eliminar el fallback de inicial salvo como placeholder de carga.
  - Recomendar tamaño/recorte al subir (cuadrado para tarjetas, vertical para reels).
- **Dónde:** `admin/.../product-form`, `product-card.tsx`, `product-item.tsx`, `menu-tabbar.tsx`.

---

## 4. Ofertas a página completa (no modal) — estilo McDonald's (P1)

**Lo que pediste y lo que hace McDonald's (captura 1):** al pulsar "Ver la oferta" **no abrir un modal**, sino una **página/hero a pantalla completa** con:
- **Marquesina diagonal animada** arriba (en McDonald's "HOY HOY HOY" con el logo M girando). En La Calita: el reclamo de la oferta o "OFERTA · OFERTA".
- **Foto del producto centrada**, grande.
- **Precio gigante** en negrita (numerales enormes, "POR 1'50 €"), con precio tachado si hay descuento.
- **Banda inferior naranja con CTA** ("Pídela en el local" / enlace).
- Debajo: lo que tenga la oferta (descripción, alérgenos, validez, valoración).

**Acción:**
- Ruta dedicada `/(public)/[locale]/hamburgueseria/oferta/[slug]` (full page), no modal.
- **Reutilizar el motor del hero de la hamburguesería** (`burger-hero.tsx` + `burger-fx.tsx`): mismas opciones (tipografía, color/degradado, fondo, efectos, posición) ya configurables desde el admin de ofertas.
- El admin de ofertas (`admin/hamburgueseria/oferta/[id]`) gana los mismos controles de estilo que el hero (y preview PC/tablet/móvil).
- Igual patrón opcional para **producto destacado** a página completa.

---

## 5. Carta / secciones estilo McDonald's–Burger King (P1)

**Captura 2 (McDonald's "productos más icónicos"):**
- Encabezado grande + descripción corta.
- **Carrusel horizontal de tarjetas de categoría**: tarjeta grande central (foto del producto sobre color de marca + nombre "Hamburguesas"), **vecinas asomando** a los lados, **flechas circulares** prev/next, **scroll con snap** y arrastre táctil.
- Botón pill **"VER TODA LA CARTA"** centrado debajo.

**Acción para la hamburguesería (y aplicable al restaurante):**
- Sección "**Nuestra carta**" en la landing con **carrusel horizontal de categorías** (Hamburguesas, Pollo, Acompañamientos, Postres…): `scroll-snap-type: x mandatory`, tarjetas `snap-center`, flechas y arrastre. Cada tarjeta enlaza a esa categoría de la carta.
- Botón **"Ver toda la carta"** → `/carta/hamburgueseria`.
- **Animación al hacer scroll (aparición):** los bloques entran con fade/slide al entrar en viewport. **Ya existe `reveal.tsx`** (IntersectionObserver) — aplicarlo a más secciones con *stagger* (retardo escalonado entre tarjetas).

**Apartados de la carta (cómo se ven):**
- Cabeceras de categoría tipo "banner" con su color, secciones ancladas (sticky tabs de categoría al hacer scroll), y tarjetas de producto con foto grande, precio claro y badges (nuevo, oferta, picante).
- En móvil: tabs de categoría con scroll horizontal pegajoso arriba; al pulsar, salta a la sección.

---

## 6. "Que todo se vea perfecto" — detalles transversales

- **Scroll con snap** en carruseles (categorías, ofertas, reels) + momentum táctil (`-webkit-overflow-scrolling:touch`, `overscroll-behavior`).
- **Animaciones de aparición** consistentes (reveal con stagger) en home, carta y landings.
- **Transiciones de página** suaves (fade) entre vistas.
- **Skeletons** mientras carga (ver `MEJORAS.md` §8) para que nunca se vea un salto/vacío.
- **Estados vacíos** bonitos (sin productos, sin ofertas) con ilustración/ícono, no en blanco.
- **Consistencia**: mismos botones (pill), mismos radios, mismas sombras, misma tipografía de precio en toda la web.

---

## Resumen de acciones por archivo

| Mejora | Archivos |
|---|---|
| Botón volver a landing | `burger-header.tsx`, `header-bar.tsx`, `hide-on-burger.tsx` |
| LangSwitcher único | nuevo `lang-switcher.tsx` + headers |
| Header animado / hide-on-scroll | `header-bar.tsx`, `burger-header.tsx`, hook `useHideOnScroll` |
| Admin 3 tamaños (móvil/tablet/PC) | `burger-hero-preview.tsx`, editores admin |
| Foto obligatoria + vídeo opcional | product form, `product-card.tsx`, `product-item.tsx` |
| Oferta a página completa | nueva ruta `hamburgueseria/oferta/[slug]`, `burger-hero.tsx`, `burger-fx.tsx`, admin oferta |
| Carrusel de categorías + "Ver toda la carta" | `burger-landing.tsx` (+ home), `reveal.tsx` |
| Aparición al scroll (stagger) | `reveal.tsx` aplicado a más bloques |

---

## Orden sugerido
1. **P0 navegación**: botón volver + LangSwitcher único (rápido, mejora UX inmediata).
2. **Oferta a página completa** + carrusel de categorías estilo McDonald's (alto impacto visual).
3. **Header animado / hide-on-scroll** + animaciones de aparición con stagger.
4. **Admin 3 tamaños** + foto obligatoria.
