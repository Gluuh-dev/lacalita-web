# Presupuesto orientativo — La Calita

_Cifras de referencia (EUR, sin IVA). Ajustar al alcance final y al mercado._
_Versión 1 · Junio 2026_

> ⚠️ **Nota**: estos importes son una **plantilla orientativa** para preparar la oferta al cliente. Revísalos según tu tarifa, el alcance definitivo y las pasarelas/servicios contratados.

---

## A. Desarrollo (pago único)

| Concepto | Incluye | Rango orientativo |
|---|---|---|
| **Web base La Calita** | Portada/hero, cartas interactivas, eventos, contenido, panel admin, 3 idiomas, responsive, despliegue | **1.800 – 3.000 €** |
| **Segunda web La Calita Burger** | Landing hamburguesería + carta + panel (reutiliza el motor) | **900 – 1.500 €** |
| **Diseño/branding por marca** | Ajuste fino de identidad, tipografías, paleta | 300 – 600 € |
| **Migración de contenido inicial** | Carga de cartas, fotos, eventos de partida | 200 – 500 € |

## B. Módulos (pago único, opcionales)

| Módulo | Rango orientativo |
|---|---|
| 🎟️ **Entradas / reservas de eventos** (aforo, pago, QR, validación) | **700 – 1.500 €** |
| 🍔 **Pedido + pago online de hamburguesas** (carrito, pasarela, gestión de pedidos) | **900 – 1.800 €** |
| 🪑 Reserva de mesa | 400 – 900 € |
| 📧 Newsletter / captación de emails | 150 – 400 € |
| ⭐ Reseñas / valoración de platos | 250 – 600 € |
| 🌐 Idioma adicional (por idioma) | 150 – 350 € |
| 📊 Analítica (privacy-friendly) | 100 – 300 € |

## C. Cuotas recurrentes (mensual / anual)

| Concepto | Coste aproximado |
|---|---|
| **Dominio** (cada uno) | 10 – 20 € / año |
| **Alojamiento (Vercel)** | 0 € (plan Hobby) – 20 €/mes (Pro, recomendado para producción) |
| **Base de datos / Supabase** | 0 € (free) – 25 €/mes (Pro, según uso) |
| **Pasarela de pago** | Comisión por transacción (p. ej. Stripe ~1,5 % + 0,25 € EU) |
| **Mantenimiento / soporte** | **40 – 120 €/mes** (actualizaciones, backups, soporte) |

> Las webs pueden empezar en planes **gratuitos** de Vercel/Supabase. Para producción seria (tráfico, pagos, fiabilidad) se recomienda Pro (~20 €/mes cada servicio).

### Coste fijo anual de servicios (lo que pediste)

| Servicio | Detalle | Coste anual aprox. |
|---|---|---|
| **Dominio La Calita** (`lacalita.es`) | Registro/renovación | ~15 € / año |
| **Dominio La Calita Burger** (`lacalitaburger.es`) | Registro/renovación | ~15 € / año |
| **Supabase Pro** | 25 $/mes ≈ 23 €/mes · base de datos, almacenamiento, backups, más capacidad | ~**280 € / año** |
| **Subtotal (2 dominios + Supabase Pro)** | | **≈ 310 € / año** |

> Notas:
> - **Un solo Supabase Pro** puede dar servicio a **las dos webs** (comparten base de datos y almacenamiento), así que no hace falta pagar dos.
> - Los dominios `.es` rondan **10–15 €/año** cada uno (el primer año a veces más barato según registrador).
> - Si además se quiere **Vercel Pro** (recomendado para producción con pagos/tráfico): **~20 €/mes ≈ 240 €/año**, también compartido por ambas webs en el mismo equipo.
> - Pasarela de pago (si se contrata el módulo de pagos): **sin cuota fija**, solo **comisión por transacción**.

**Resumen anual mínimo recomendado** (2 dominios + Supabase Pro): **≈ 310 €/año**.
Con Vercel Pro incluido: **≈ 550 €/año**.

---

## C-bis. Qué se necesita para cada gestión

**Gestionar entradas / reservas de eventos**
- Base de datos (Supabase) — eventos, entradas, compradores, aforo.
- Pasarela de pago si se cobra online (Stripe/Redsys) — _o reserva sin pago = gratis_.
- Email transaccional para enviar la entrada/QR (Resend, Brevo…).
- Generación de QR y validación en puerta — **incluida en el desarrollo** (sin coste extra de servicio).
- Recomendado **Supabase Pro** si hay volumen de ventas.

**Gestionar imágenes (subir/cambiar fotos y vídeos)**
- Almacenamiento de archivos: **Supabase Storage** (incluido). Free: ~1 GB · Pro: 100 GB.
- Optimización automática de imágenes (AVIF/WebP) — **incluida**.

**Cambiar cosas en la web (textos, precios, cartas, portadas…)**
- **Panel de administración** — incluido en el desarrollo.
- Base de datos + **autenticación** del panel (Supabase) — incluido.
- **Alojamiento** (Vercel) con publicación automática de los cambios.
- Para producción estable: **Supabase Pro** (y opcionalmente Vercel Pro).

> En resumen, para que el cliente pueda **gestionar entradas, imágenes y contenido** de forma fiable, lo mínimo recomendado es: **2 dominios + Supabase Pro (~310 €/año)**, y si hay pagos online, añadir **pasarela** (solo comisión) y **email transaccional** (suele haber plan gratuito).

---

## D. Paquetes sugeridos

### Paquete 1 — "Presencia" (una sola web)
La Calita base + 3 idiomas + panel + despliegue.
**≈ 2.000 – 3.000 €** + cuotas (dominio + hosting + mantenimiento).

### Paquete 2 — "Dos marcas" (recomendado)
La Calita + La Calita Burger (dos webs independientes) + panel + 3 idiomas.
**≈ 3.000 – 4.500 €** + cuotas.

### Paquete 3 — "Completo / e-commerce"
Dos webs + **entradas de eventos** + **pedido y pago de hamburguesas**.
**≈ 4.800 – 7.500 €** + cuotas + comisiones de pasarela.

---

## E. Forma de pago sugerida

- 40 % al inicio · 30 % en entrega de la primera web · 30 % al cierre.
- Mantenimiento facturado mensual o anual.

## F. Qué incluye siempre

- Diseño responsive (PC / tablet / móvil).
- Panel de administración autogestionable.
- 3 idiomas con traducción asistida.
- Despliegue, HTTPS y formación básica del panel (1 sesión).
- Código en repositorio (propiedad del cliente al cierre, si se acuerda).

## G. No incluido (salvo acuerdo)

- Producción de fotos/vídeos profesionales.
- Redacción de textos legales por abogado.
- Comisiones de pasarela de pago.
- Campañas de marketing / SEO avanzado / publicidad.
