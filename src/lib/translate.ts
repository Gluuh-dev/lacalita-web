// Auto-traducción ES → {es,en,fr} con Google Cloud Translation.
// ponytail: sin GOOGLE_TRANSLATE_API_KEY, espeja el es en en/fr (la web ya muestra
// algo); cuando haya key, traduce de verdad. El admin puede corregir en/fr a mano.
const TARGETS = ['en', 'fr'] as const;

export async function translateField(
  es: string
): Promise<{es: string; en: string; fr: string}> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  const base = {es, en: es, fr: es};
  if (!key || !es.trim()) return base;

  try {
    const out = {...base};
    for (const target of TARGETS) {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${key}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({q: es, source: 'es', target, format: 'text'})
        }
      );
      const json = await res.json();
      out[target] = json?.data?.translations?.[0]?.translatedText ?? es;
    }
    return out;
  } catch {
    return base;
  }
}
