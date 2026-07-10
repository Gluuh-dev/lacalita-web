# Rendimiento — caché, imágenes, fuentes, JS, PWA

> Severidad: 🔴 alta · 🟡 media · ⚪ baja. Todo con `ruta:línea`.

## 🔴 `/burguer` se sale del ISR sin querer

`burguer/page.tsx:6` declara `revalidate = 300`, pero en la línea 27 llama
`getAllergens()`, que usa `createClient()` → `await cookies()` → **la página
entera pasa a dinámica**: se renderiza en CADA visita y, como
`getBurgerSlides`/`getBurgerOffers` van sin caché, **golpea Supabase en cada
request** (egress del plan free). Los alérgenos son datos públicos.

**Arreglo**: `getAllergens` → `supabasePublic` + `unstable_cache` (tag
`menu`). Pequeño y devuelve la landing al CDN.

## 🔴 El LCP de la portada es un `<img>` plano

`hero.tsx:506` (y la rama contain `:473,483`) sirven el fondo del hero — lo
primero que se ve — con `<img>`: el original de Supabase sin AVIF/WebP, sin
redimensionar, sin `priority`. `next/image` con `fill priority` es viable (el
host ya está en `remotePatterns`). **La mayor ganancia de velocidad del sitio.**

## 🟡 framer-motion solo para un fade

`reveal.tsx:3` importa `motion` y `<Reveal>` envuelve ~9 secciones de la
portada → ~30-50 KB gzip en el first-load para un fade-up al hacer scroll.
Ya existe `@keyframes ds-fade-up` (`globals.css:297`) y el manejo de
`prefers-reduced-motion`. → IntersectionObserver + clase CSS y framer-motion
sale del bundle de la home.

## 🟡 Fuentes

- `layout.tsx:22-30` precarga **7 familias** de next/font. Great Vibes y
  Kaushan casi solo se usan en hero/artista → valorar sacarlas de la precarga.
- Locales por `@font-face`, **todas en TTF/OTF** (sin woff2):

| Fuente | Fichero | Peso |
|---|---|---|
| **Tosca Zero** | `tosca_zero.ttf` | **620 KB** → ~200 KB en woff2 |
| Eight One | `eight-one.ttf` | 48 KB |
| Modern Romance | `modern-romance.otf` | 26 KB |
| Adam | `adam.ttf` | 12 KB |

Se descargan bajo demanda (bien), pero convertir a woff2 es ganancia gratis.

## 🟡 Imágenes (además del hero)

- `event-card.tsx:49` — `sizes="100vw"` para una miniatura de 112-136px
  (detalle en 01). → `sizes="136px"`.
- Portada `page.tsx:296-300` — galería con `<img>` sin lazy bajo el pliegue.
- ⚪ `sizes` levemente desajustados: `page.tsx:179,218`, `event-card.tsx:75`.
- Bien: `eventos/[id]` y `eventos` destacado con `priority`; `gallery-grid`
  afinado; `product-item` correcto.

## 🟡 `getMediaUsage` sin caché

`admin/galeria/page.tsx:10` escanea **el bucket entero** (paginado, varias
llamadas `list()`) en cada visita a la página, que es dinámica. → Cachear
(revalidate corto + tag) o calcular bajo demanda con un botón.

## Caché de datos — estado y huecos

Cacheado con `unstable_cache` (correcto): `getMenus`, `getMenu`,
`getSettings`, `getFeaturedProducts`, `getUpcomingEvents` (120s),
`getPastEvents`, `getPublicEvent`, `getEventTickets`.

Sin caché pero servido desde páginas ISR (aceptable): `getProduct`,
`getBurgerSlides/Offers` (⚠ salvo el caso `/burguer` de arriba),
`getGalleryAlbums` (sin caché **a propósito**, documentado).

Huecos menores:
- ⚪ `galeria/actions.ts:22,34` invalida el tag `gallery`… que **ningún query
  usa** (tag muerto). Etiquetar `getGalleryAlbums` o quitar la llamada.
- ⚪ `hamburgueseria/actions.ts` no invalida ningún tag — hoy da igual (sus
  queries no están cacheados), bomba de relojería si algún día se cachean.
- ⚪ Todas las actions hacen `revalidatePath('/','layout')`: martillo global.
  Funciona; poco fino.

## Skeletons / loading.tsx

Cobertura excelente (16 ficheros). Faltan solo: ⚪ `carta/[menu]/video` y
`burguer/video`. `.lc-img-loading` bien repartido.

## ⚪ PWA

`public/sw.js` es network-first: online siempre sirve HTML fresco (sin riesgo
de deploy roto), pero **no aporta velocidad** (nada cache-first) y su caché
crece sin límite hasta el cambio de versión. Decisión pendiente: cache-first
para `/_next/static/` (inmutable) o retirarlo. Manifest sin iconos
PNG/maskable (la instalación en Android puede verse mal).

## ⚪ Otros

- `generateStaticParams` ausente en `carta/[menu]`, `carta/[menu]/[producto]`,
  `eventos/[id]`, `burguer/…` — pre-generar los pocos menús/eventos acelera el
  primer hit.
- `product-card.tsx` — componente muerto (nadie lo importa). Borrar.
- Home revalida a 300 con eventos anidados a 120: un evento pasado puede
  persistir hasta 300s. Menor.
- Terceros: mapas con `loading="lazy"` ✓; sin analytics ni scripts externos ✓;
  el "mapa" de la portada es CSS puro (0 coste) ✓.
