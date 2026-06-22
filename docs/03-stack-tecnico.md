# 03 — Stack técnico

## Resumen

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Next.js (App Router) + TypeScript**, última versión | SSR/SSG para SEO perfecto, rutas por idioma, imágenes optimizadas |
| Estilos | **Tailwind CSS v4** (última) | Config CSS-first, dos temas por tokens, cero CSS muerto |
| Componentes | **shadcn/ui** + registry de Supabase | Componentes accesibles, copy-in (sin dependencia pesada). Solo lo que necesitemos |
| Animación | **Framer Motion** (última) | Fluido, declarativo, `layout` animations, gestos |
| Datos/Auth/Storage | **Supabase** | Postgres + login admin + bucket de imágenes/vídeos, todo gratis al inicio |
| Estado cliente | **Zustand** (solo si hace falta) | Idioma/filtros UI. La mayoría se resuelve con server components |
| i18n | **next-intl** | Rutas `/[locale]`, mensajes, integra con App Router |
| Toasts admin | **Sonner** | Notificaciones bonitas en el panel |
| Traducción | **Google Cloud Translation API** | Auto-rellenar EN/FR al guardar (ver `06`) |
| Gestor paquetes | **pnpm** | Obligatorio. Nunca npm |
| Hosting | **Vercel** (a confirmar) | Next.js nativo, gratis, deploy por git |
| PWA | **@ducanh2912/next-pwa** o SW manual | Instalable, offline básico de la carta |

## Notas importantes

### "Que sea persistente"
- **Vercel + Supabase free tier:** la base de datos de Supabase gratis **se pausa
  tras ~1 semana de inactividad**. Para un negocio real esto es un riesgo.
  - Opción A (recomendada): plan **Supabase Pro (~25$/mes)** → siempre activa,
    backups, más storage para vídeos.
  - Opción B: seguir en free y un cron que la "despierte" (frágil, no recomendado
    para producción).
- Vercel free sirve de sobra para una web así; sin pausas de hosting.
- **Decisión tomada:** Supabase **free durante el desarrollo**; al pasar a producción
  se sube a **Pro** (siempre activa, backups, más storage para vídeos).

### Vídeos
- Vídeos pesan. Subir directamente a Supabase Storage funciona, pero para muchos
  vídeos largos conviene un servicio de vídeo (Mux/Cloudflare Stream) más adelante.
- `ponytail:` empezamos con Supabase Storage + `<video>` nativo. Migrar a Mux solo
  si el peso/calidad lo pide.

### Imágenes
- `next/image` para optimización automática (AVIF/WebP, tamaños responsive).
- Originales en Supabase Storage; Next sirve optimizado.

## Estructura de carpetas (propuesta)

```
src/
  app/
    [locale]/
      page.tsx                 landing
      carta/...                cartas y detalle
      eventos/page.tsx
    admin/...                  panel (fuera de i18n)
    sitemap.ts  robots.ts  manifest.ts
  components/                  UI compartida + por tema
  lib/
    supabase/                  cliente server/browser
    i18n/                      config next-intl
    translate.ts               wrapper Google Translate
  styles/
public/
  brand/                       logos SVG + iconos PWA
```

## Versiones
Todo a la **última versión estable** al instalar (Next, React, Tailwind v4, Framer
Motion, shadcn/ui, supabase-js). Instalación **siempre con pnpm** (`pnpm dlx` en vez de
`npx`).

## Variables de entorno (al empezar)

Proyecto Supabase de **desarrollo** (no definitivo): `szylffdzkjjrqlfyncqv`.

```
NEXT_PUBLIC_SUPABASE_URL=https://szylffdzkjjrqlfyncqv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aVhWCZieYomgTF1jLItDmA_a4GakZnI
SUPABASE_SERVICE_ROLE_KEY=        # solo server (admin, traducción) — pendiente
GOOGLE_TRANSLATE_API_KEY=         # pendiente
```

> La `PUBLISHABLE_KEY` es pública (sustituye a la antigua anon key) y puede ir en el
> cliente. El `service_role` NUNCA en el cliente.

## MCP de Supabase
- Servidor MCP en `.mcp.json` (scope proyecto), proyecto `szylffdzkjjrqlfyncqv`,
  **escritura habilitada** (sin `read_only`).
- Requiere autenticación manual: en una terminal normal `claude /mcp` → seleccionar
  `supabase` → Authenticate.
- El agente aplica el esquema/migraciones directamente vía MCP. Aun así, **todo cambio
  queda también como `.sql` en `supabase/migrations/`** (fuente de verdad para la base
  real) — ver `04-modelo-de-datos.md`.
- Skills instaladas: `supabase`, `supabase-postgres-best-practices` (en `.agents/skills/`).
