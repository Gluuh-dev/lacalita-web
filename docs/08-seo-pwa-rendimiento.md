# 08 — SEO, PWA y rendimiento

## SEO (prioridad alta)

- **Renderizado servidor** (SSR/SSG con Next.js) → Google indexa contenido real.
- **Metadata por página** con la API de metadata de Next (`generateMetadata`):
  título, descripción, canonical, `hreflang` para es/en/fr.
- **Open Graph + Twitter Card** por página y por **producto** y **evento** →
  enlaces que se comparten salen con foto y título bonitos.
- **Imágenes OG** generadas (logo + nombre) con `next/og` para productos/eventos.
- **Datos estructurados schema.org** (JSON-LD):
  - `Restaurant` (nombre, dirección, horario, geo, teléfono) en la landing.
  - `Menu` / `MenuItem` en las cartas.
  - `Event` en eventos.
- **`sitemap.xml`** dinámico (incluye cada carta, producto y evento en los 3 idiomas).
- **`robots.txt`** correcto.
- URLs limpias y con slug legible (`/es/carta/restaurante/poke-de-salmon`).
- Rendimiento = SEO: ver sección de abajo.

## Compartir

- Cada producto y evento tiene URL propia, indexable y con OG → se comparte por
  WhatsApp/redes con preview.
- Botón "compartir" (Web Share API nativa en móvil).

## PWA (instalable)

- **`manifest.ts`**: nombre, iconos (desde `logo-solo.svg`), color de tema `#E9AE74`,
  `display: standalone`, `start_url`.
- **Service worker** (`@ducanh2912/next-pwa` o SW manual): cachea la carta para
  carga instantánea y offline básico tras la primera visita.
- "Añadir a pantalla de inicio" en móvil.
- Iconos: 192, 512, maskable, apple-touch-icon, favicon.

## Rendimiento

- `next/image` (AVIF/WebP, lazy, tamaños responsive).
- Vídeos: `preload="metadata"`, poster, lazy; no autoplay con sonido.
- Fuentes con `next/font` (sin parpadeo, self-host).
- Animaciones con transform/opacity (GPU), respetar `prefers-reduced-motion`.
- Objetivo: **Lighthouse 90+** en Performance/SEO/Best Practices/Accessibility.

## Accesibilidad (base)

- Contraste suficiente en ambos temas.
- Alt en imágenes (usar el nombre del producto).
- Navegación por teclado en el admin y la carta.
- `prefers-reduced-motion` desactiva animaciones no esenciales.
