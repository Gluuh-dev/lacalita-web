import {NextResponse} from 'next/server';
import {supabasePublic} from '@/lib/supabase/public';

export const dynamic = 'force-dynamic';

// Mantiene viva la base de datos (Supabase free se pausa a los ~7 días sin actividad).
// Apunta aquí un monitor gratuito (UptimeRobot) cada pocos minutos/días.
export async function GET() {
  try {
    await supabasePublic.from('menus').select('id').limit(1);
    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json({ok: false}, {status: 500});
  }
}
