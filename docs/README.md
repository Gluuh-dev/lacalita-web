# La Calita — Documentación del proyecto

Web del restaurante **La Calita Beach Club**: cafetería + restaurante + hamburguesería.
Acceso principal por **QR → carta digital**. Landing con info del sitio, eventos
(DJs / conciertos) y dos cartas con identidad visual distinta. Panel de admin para
editarlo TODO sin tocar código.

> Estado: **fase de documentación**. Aún no hay código. Esta carpeta es el contrato
> de lo que vamos a construir. Cuando esté aprobada, empezamos.

## Decisiones cerradas

| Tema | Decisión |
|------|----------|
| Alcance | **Solo carta digital** (ver productos, precios, alérgenos). Sin carrito ni pagos. |
| Front | Next.js (App Router) + TypeScript + **Tailwind CSS v4** (todo última versión) |
| Componentes | **shadcn/ui** (solo lo necesario) |
| Animaciones | **Framer Motion** (descartado anime.js) |
| Backend / DB | **Supabase** (Postgres + Auth + Storage para imágenes/vídeos) |
| Estado cliente | **Zustand** solo si hace falta (idioma/filtros). Por defecto, nada. |
| Notificaciones admin | **Sonner** (toasts) |
| Gestor de paquetes | **pnpm siempre**, nunca npm |
| Idiomas | ES (defecto), EN, FR. Traducción **auto al guardar** vía Google Translate API |
| PWA | Sí, instalable |
| SEO | Prioridad alta: metadata, sitemap, schema.org, Open Graph |
| Hosting | Vercel (a confirmar — ver nota de "persistencia" en `03-stack-tecnico.md`) |
| Supabase | **Free durante el desarrollo → Pro al pasar a producción** |

## Identidades visuales

1. **La Calita (restaurante / desayunos):** arena/beige (`#e9ae74`), serif elegante,
   tema playa, premium y suave.
2. **Hamburguesería:** naranja/rojo energético, tipografía grande, contraste oscuro,
   dinámico. Carta con estructura y estilo **totalmente distintos**.

## Índice

1. [`01-concepto-marca.md`](01-concepto-marca.md) — marca, tono, las dos identidades
2. [`02-mapa-y-paginas.md`](02-mapa-y-paginas.md) — sitemap, páginas, flujos
3. [`03-stack-tecnico.md`](03-stack-tecnico.md) — tecnologías y por qué
4. [`04-modelo-de-datos.md`](04-modelo-de-datos.md) — esquema Supabase (SQL)
5. [`05-diseno-y-animaciones.md`](05-diseno-y-animaciones.md) — sistema de diseño
6. [`06-i18n-traducciones.md`](06-i18n-traducciones.md) — idiomas y auto-traducción
7. [`07-panel-admin.md`](07-panel-admin.md) — qué edita el admin y cómo
8. [`08-seo-pwa-rendimiento.md`](08-seo-pwa-rendimiento.md) — SEO, PWA, performance
9. [`09-contenido-inicial.md`](09-contenido-inicial.md) — carta real para cargar

## Pendiente de aportar

- **Carta de hamburguesería real** — ahora hay productos FICTICIOS de relleno
  (se cambian desde el admin).
- Fotos/vídeos reales de productos.
- Teléfono y horarios **reales** — ahora hay valores PROVISIONALES inventados.
- Confirmar dominio.

## Datos ya confirmados

- **Dirección:** C. Pº Marítimo, s/n, 18680 Salobreña, Granada.
- **Instagram:** https://www.instagram.com/lacalitabeach/
- **Facebook:** https://www.facebook.com/people/La-Calita-Beach/61570968837712/
- **Supabase:** free en desarrollo, Pro en producción.
