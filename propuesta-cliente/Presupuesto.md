# Presupuesto orientativo — La Calita

_Cifras de referencia (EUR, sin IVA). Ajustar al alcance final y al mercado._
_Versión 1 · Junio 2026_

> ⚠️ **Nota**: estos importes son una **plantilla orientativa** para preparar la oferta al cliente. Revísalos según tu tarifa, el alcance definitivo y las pasarelas/servicios contratados.

---

## A. Desarrollo (pago único)

| Concepto | Incluye | Rango orientativo |
|---|---|---|
| **Web La Calita** | Portada/hero, cartas interactivas, eventos, contenido, panel admin, 3 idiomas, responsive, despliegue | **1.800 – 3.000 €** |
| **Sección Hamburguesería** | Landing propia (hero con efectos), carta en tema oscuro y panel de gestión, dentro de la misma web | **700 – 1.200 €** |
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

> ⚠️ **Importante (Supabase Free)**: el plan gratuito de Supabase **pausa el proyecto tras ~7 días sin actividad**. Para una web de negocio en producción —que puede tener días de poco tráfico— eso significa que **la web se quedaría sin datos hasta reactivarla a mano**. Por eso, para producción se necesita **Supabase Pro** (no se pausa, incluye backups y más capacidad). El plan Free solo sirve para **pruebas/desarrollo**, no para el sitio en marcha.
>
> Vercel Free (Hobby) **no se pausa** y sirve para arrancar, pero su licencia es de uso personal/no comercial; para producción se recomienda Vercel Pro.

### Coste fijo anual de servicios

> **Decisión: un único dominio.** La web es **un solo sitio** que incluye la sección de hamburguesería en `tudominio.com/hamburgueseria`. Un solo dominio, un solo Supabase, un solo despliegue.

| Servicio | Detalle | Coste anual aprox. |
|---|---|---|
| **Dominio** (`lacalita.es` o `.com`) | Registro/renovación | ~15 € / año |
| **Supabase Pro** | 25 $/mes ≈ 23 €/mes · base de datos, almacenamiento, backups, más capacidad | ~**280 € / año** |
| **Subtotal (dominio + Supabase Pro)** | | **≈ 295 € / año** |

> Notas:
> - El dominio `.es`/`.com` ronda **10–15 €/año** (el primer año a veces más barato según registrador).
> - Si además se quiere **Vercel Pro** (recomendado para producción con pagos/tráfico): **~20 €/mes ≈ 240 €/año**.
> - Pasarela de pago (si se contrata el módulo de pagos): **sin cuota fija**, solo **comisión por transacción**.

**Resumen anual mínimo recomendado** (dominio + Supabase Pro): **≈ 295 €/año**.
Con Vercel Pro incluido: **≈ 535 €/año**.

### Supabase y base de datos (aclaración)

- **Supabase Pro se paga por _cuenta/organización_ (25 $/mes ≈ 23 €/mes), no por web.** Incluye ~10 $ de créditos de cómputo.
- Dentro de esa cuenta puede haber varios **proyectos**; cada **proyecto = una base de datos** Postgres.
  - El plan Pro **cubre 1 proyecto**. Cada **proyecto adicional** activo añade su propio cómputo (~**10 $/mes ≈ 110 €/año** extra).
  - Dentro de un proyecto: **tablas ilimitadas**, **8 GB de BD** incluidos (luego ~0,125 $/GB) y **100 GB de almacenamiento** de fotos/vídeos.

**Para La Calita (web única con sección hamburguesería):**

- **Una sola base de datos** (un proyecto Supabase Pro) → **~280 €/año**. Cubre toda la web: cartas, hamburguesería, eventos, contenido e imágenes.
- No hace falta un segundo proyecto ni segundo Supabase.

> _Nota: Supabase puede ajustar sus precios; cifras orientativas a fecha de este documento._

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

### Paquete 1 — "Presencia"
Web La Calita (cartas, eventos, contenido) + 3 idiomas + panel + despliegue. **Un dominio.**
**≈ 2.000 – 3.000 €** + cuotas (dominio + Supabase Pro + mantenimiento).

### Paquete 2 — "La Calita + Hamburguesería" (recomendado)
Todo lo anterior + **sección hamburguesería** (landing, carta oscura, panel), **mismo dominio**.
**≈ 2.700 – 4.000 €** + cuotas.

### Paquete 3 — "Completo / e-commerce"
Paquete 2 + **entradas de eventos** + **pedido y pago de hamburguesas**.
**≈ 4.300 – 6.500 €** + cuotas + comisiones de pasarela.

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
