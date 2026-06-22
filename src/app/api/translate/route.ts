import {NextResponse} from 'next/server';

// Traducción gratuita (sin API key) es -> {en,fr,...}. Usa MyMemory y, si falla,
// el endpoint público de Google. Es para asistir al editor (botón "traducir"),
// no para producción masiva.
export async function POST(req: Request) {
  let text = '';
  let to = 'en';
  try {
    const body = await req.json();
    text = (body.text ?? '').toString();
    to = (body.to ?? 'en').toString();
  } catch {
    return NextResponse.json({error: 'bad request'}, {status: 400});
  }
  if (!text.trim()) return NextResponse.json({text: ''});

  // 1) MyMemory
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${to}`, {
      headers: {'User-Agent': 'lacalita-web'}
    });
    const j = await r.json();
    const t = j?.responseData?.translatedText;
    if (t && !/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(t)) return NextResponse.json({text: t});
  } catch {
    /* sigue al respaldo */
  }

  // 2) Respaldo: endpoint público de Google
  try {
    const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
    const j = await r.json();
    const t = (j?.[0] ?? []).map((seg: unknown[]) => seg?.[0]).join('');
    if (t) return NextResponse.json({text: t});
  } catch {
    /* nada */
  }

  return NextResponse.json({text, fallback: true});
}
