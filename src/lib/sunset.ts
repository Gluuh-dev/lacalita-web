// Hora del atardecer en Salobreña, calculada (nada de API): algoritmo de
// salida/puesta de sol de la NOAA, simplificado.
const LAT = 36.742;
const LON = -3.588;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Devuelve la fecha/hora de la puesta de sol del día que se le pase. */
export function sunsetAt(date: Date): Date {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);

  const zenith = 90.833; // borde superior del sol + refracción
  const lngHour = LON / 15;
  const t = dayOfYear + (18 - lngHour) / 24; // 18 = tarde (puesta)

  const M = 0.9856 * t - 3.289;                       // anomalía media
  let L = M + 1.916 * Math.sin(rad(M)) + 0.02 * Math.sin(rad(2 * M)) + 282.634; // longitud verdadera
  L = (L + 360) % 360;

  let RA = deg(Math.atan(0.91764 * Math.tan(rad(L)))); // ascensión recta
  RA = (RA + 360) % 360;
  RA += (Math.floor(L / 90) - Math.floor(RA / 90)) * 90; // al mismo cuadrante que L
  RA /= 15;

  const sinDec = 0.39782 * Math.sin(rad(L));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(rad(zenith)) - sinDec * Math.sin(rad(LAT))) / (cosDec * Math.cos(rad(LAT)));
  if (cosH > 1 || cosH < -1) return date; // sol que no se pone (no pasa aquí)

  const H = deg(Math.acos(cosH)) / 15;
  const T = H + RA - 0.06571 * t - 6.622;
  const utc = ((T - lngHour) % 24 + 24) % 24; // hora UTC de la puesta

  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCHours(Math.floor(utc), Math.round((utc % 1) * 60), 0, 0);
  return d;
}
