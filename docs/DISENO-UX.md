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

## 6. Bloques de pie de landing: "Síguenos" y "Encuéntranos" (P1)

**Capturas 1 (McDonald's):** al final de la landing, dos tarjetas grandes:

### 6.1 "Síguenos" (redes sociales)
- Tarjeta con **fondo de collage** de fotos (mosaico), logo centrado, titular cálido ("Síguenos y estate al tanto de todo :)") y **iconos circulares de redes** (Facebook, Instagram, YouTube, TikTok).
- En La Calita: fondo con color de marca (cálido en restaurante / oscuro-naranja en burger), iconos a Instagram/Facebook/TikTok (los que tenga el negocio). URLs configurables en **Ajustes** del admin.
- **Dónde:** nueva sección en `burger-landing.tsx` y en la home; URLs en `settings` (admin/ajustes).

### 6.2 "Encuéntranos" (ubicación)
- Tarjeta con **fondo de mapa estilizado** + pin de marca, titular ("Encuéntranos" / "Cómo llegar") y **botón pill** ("Cómo llegar" → abre Google Maps con la dirección).
- En La Calita basta **un local**, así que en vez de "busca tu restaurante" → **"Cómo llegar"** directo al mapa, con dirección y horario al lado.
- **Dónde:** sección en home y burger-landing; dirección/coords en `settings`.

---

## 7. Barra de tabs de navegación (estilo Burger King) (P1)

**Capturas 3–4 (Burger King):** barra inferior fija con **iconos + etiqueta**: Inicio · MyBurgerKing · Pedir · Ofertas · Carta. Color de marca, pestaña activa resaltada.

- **Estado:** ya existe una tab bar en la **carta** (`menu-tabbar.tsx`) para favoritos/lista. Conviene un patrón **coherente** y, si se quiere, una tab bar de **navegación del sitio** en móvil.
- **Acción:**
  - Diseño unificado: barra inferior fija (móvil), iconos + etiqueta corta, **pestaña activa** con color/realce, respeta `safe-area-inset-bottom`.
  - Tabs sugeridas para La Calita: **Inicio · Carta · Eventos · Mi lista · Síguenos/Ubicación** (o las que tengan sentido). En la hamburguesería: **Inicio · Carta · Ofertas · Mi lista**.
  - Una sola implementación reutilizable con `items[]` (icono, etiqueta, href, activo).
- **Dónde:** refactor de `menu-tabbar.tsx` a un `TabBar` reutilizable; usarlo en carta y, opcionalmente, en las landings.

---

## 8. Páginas legales, FAQ y contacto (P1)

**Captura 4 (Burger King — menú):** secciones "Información y Soporte", "Ayuda" y "Más" con: **Contacto, Preguntas Frecuentes, Sin Gluten, Términos y condiciones, Aviso Legal, Política de Privacidad, Política de Cookies, Configuración de cookies**.

- **Acción — crear estas páginas/secciones** (contenido editable desde admin donde aplique):
  - **Preguntas frecuentes (FAQ):** acordeón con preguntas habituales (horarios, reservas, alérgenos, eventos, cómo llegar…). Editable en admin (`contenido`).
  - **Sin gluten / alérgenos:** página explicando opciones sin gluten y el sistema de alérgenos (ya hay iconos de 14 alérgenos).
  - **Contacto:** datos + (opcional) formulario que envíe email (engancha con el roadmap de emails en `MEJORAS.md`).
  - **Legales:** Aviso legal, Política de privacidad, Términos y condiciones, **Política de cookies**.
- **Dónde:** rutas en `(public)/[locale]/` (`/faq`, `/sin-gluten`, `/contacto`, `/legal/...`); enlaces en el menú hamburguesa y en el footer.

---

## 9. Cookies — banner de consentimiento (P0 legal)

- **Obligatorio (RGPD/LSSI en España):** **banner de cookies** al entrar, con opciones **Aceptar / Rechazar / Configurar**, y un enlace permanente a **"Configuración de cookies"** y a la **Política de cookies**.
- **Acción:**
  - Banner inferior no intrusivo; guarda la elección (localStorage/cookie) y **no carga analítica/marketing hasta consentir**.
  - Página **Política de cookies** + acceso a **Configuración de cookies** (como en BK) para cambiar la elección luego.
  - Si más adelante se añade analítica (Plausible/GA), respetar el consentimiento.
- **Dónde:** nuevo `cookie-consent.tsx` en el layout público; página `/legal/cookies`.
- **Nota honesta:** los **textos legales** (privacidad, cookies, términos) conviene que los revise un abogado o usar una plantilla fiable; yo dejo la estructura y el banner funcionando.

---

## 10. "Que todo se vea perfecto" — detalles transversales

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
| Bloque "Síguenos" (redes) | `burger-landing.tsx` + home; URLs en `settings`/`admin/ajustes` |
| Bloque "Encuéntranos" (mapa/cómo llegar) | landings + home; dirección/coords en `settings` |
| Tab bar de navegación unificada | refactor `menu-tabbar.tsx` → `TabBar` reutilizable |
| FAQ / Sin gluten / Contacto / Legales | rutas `(public)/[locale]/faq`, `/sin-gluten`, `/contacto`, `/legal/*` |
| Banner de cookies + política | nuevo `cookie-consent.tsx` en layout + `/legal/cookies` |

---

## Orden sugerido
1. **P0 navegación**: botón volver + LangSwitcher único (rápido, mejora UX inmediata).
2. **Oferta a página completa** + carrusel de categorías estilo McDonald's (alto impacto visual).
3. **Header animado / hide-on-scroll** + animaciones de aparición con stagger.
4. **Admin 3 tamaños** + foto obligatoria.
