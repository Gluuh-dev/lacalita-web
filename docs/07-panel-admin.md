# 07 — Panel de administración

Objetivo: el dueño edita **todo** sin tocar código ni saber de tecnología.
Acceso en `/admin`, protegido con **Supabase Auth** (email + contraseña, un solo admin
para empezar). Notificaciones con **Sonner**.

## Qué puede hacer

### Landing `/admin/landing`
- Editar textos del hero y bloques de presentación.
- **Subir imágenes y vídeos** y colocarlos en la landing.
- Reordenar bloques.

### Cabeceras de carta `/admin/menus`
- Por cada carta (restaurante / hamburguesería): título, subtítulo, **imagen o vídeo
  de cabecera**. (Esto es el "poner cosas nuevas en la cabecera" que pediste.)

### Categorías `/admin/categorias`
- Crear/editar/borrar categorías por carta.
- **Reordenar arrastrando** (ref MENURY).
- Mostrar/ocultar una categoría.

### Productos `/admin/productos`
- Crear/editar/borrar productos.
- Campos: nombre, descripción, **precio único o variantes** (media/entera),
  categoría, **foto y/o vídeo**, alérgenos (multiselección con iconos),
  destacado, disponible.
- Subida de medios con preview.
- Al guardar en ES → traduce auto a EN/FR (editable).
- Reordenar dentro de la categoría.

### Eventos `/admin/eventos`
- Crear/editar/borrar eventos: título, artista/DJ, fecha y hora, foto, descripción,
  publicado. (Anunciar conciertos/DJs por día.)

### Horarios y datos `/admin/horarios`
- Horarios por día, dirección, Google Maps, teléfono, email, redes sociales.

## UX del admin

- Lista + formulario, simple y rápido. Sin florituras.
- Validación básica (precio numérico, campos obligatorios).
- Feedback inmediato (Sonner): "Guardado", "Traducido", "Error, reintenta".
- Subida de medios: arrastrar/soltar, barra de progreso, límite de tamaño de vídeo.

## Seguridad

- Rutas `/admin/**` solo accesibles autenticado (middleware).
- Escrituras a DB protegidas por RLS (ver `04`), no solo por la UI.
- Service role key **solo en server**, nunca en el cliente.

> `ponytail:` un único usuario admin creado a mano en Supabase. Nada de registro
> público ni gestión de usuarios hasta que haga falta.
