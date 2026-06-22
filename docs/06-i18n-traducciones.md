# 06 — Idiomas y traducción automática

## Idiomas

- **ES** — por defecto (`/es`, y raíz redirige a `/es`).
- **EN** — `/en`.
- **FR** — `/fr`.

Routing y mensajes de interfaz (botones, etiquetas fijas) con **next-intl**.
Los textos fijos de UI van en archivos `messages/{es,en,fr}.json` (traducidos a mano,
son pocos).

## Contenido dinámico (productos, categorías, eventos…)

Cada campo traducible es `jsonb {es,en,fr}` en la base de datos (ver `04`).

### Auto-traducción al guardar
1. El admin escribe el contenido en **español**.
2. Al guardar, una **Server Action / Edge Function** llama a **Google Cloud
   Translation API** y rellena `en` y `fr` a partir del `es`.
3. Los campos `en`/`fr` quedan **editables**: el admin puede corregir a mano y, si lo
   hace, se respeta (un flag o simplemente no re-traducir si ya hay texto manual).

```
guardar producto (es) ──► translate(es → en), translate(es → fr)
                          guardar {es, en, fr} en el campo jsonb
```

### Reglas
- Solo se traduce lo que cambió (no gastar API en cada guardado completo).
- Botón "re-traducir" manual por si se quiere regenerar.
- Si la API falla, se guarda igualmente el `es` y se avisa (Sonner) para reintentar.
- Precios y números no se traducen; solo nombres y descripciones.

### Coste
- Google Translate cobra por carácter (~20$/millón de caracteres). Para una carta
  son céntimos. Cachéamos resultado en DB → no se vuelve a pagar al mostrarlo.

> `ponytail:` empezar solo con ES+EN si se quiere abaratar; FR se activa cambiando la
> lista de locales. La arquitectura ya lo soporta.

## Selección de idioma en la web

- Selector con banderas en el header (ref ANOIS/MENURY).
- Detección por `Accept-Language` en la primera visita, luego respeta la elección.
