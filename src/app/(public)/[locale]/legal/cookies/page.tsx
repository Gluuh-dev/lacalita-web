import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';

export const metadata: Metadata = {title: 'Política de cookies · La Calita'};

export default async function CookiesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <main className="mx-auto max-w-2xl px-5 py-28">
      <h1 className="font-serif text-3xl font-bold">Política de cookies</h1>
      <div className="mt-6 flex flex-col gap-4 leading-relaxed text-ink-2">
        <p>
          En La Calita usamos cookies y tecnologías similares para que la web funcione correctamente
          y, con tu consentimiento, para analizar de forma anónima cómo se utiliza.
        </p>

        <h2 className="mt-4 font-serif text-xl font-semibold text-ink">¿Qué son las cookies?</h2>
        <p>
          Son pequeños archivos que se guardan en tu dispositivo al visitar la web. Sirven para
          recordar tus preferencias (por ejemplo, el idioma o tu lista de platos guardados).
        </p>

        <h2 className="mt-4 font-serif text-xl font-semibold text-ink">Tipos de cookies que usamos</h2>
        <ul className="ml-5 list-disc">
          <li><strong>Necesarias:</strong> imprescindibles para el funcionamiento (idioma, favoritos y lista guardados en tu navegador). No requieren consentimiento.</li>
          <li><strong>Analíticas (opcionales):</strong> nos ayudan a entender el uso de la web de forma anónima. Solo se activan si las aceptas.</li>
        </ul>

        <h2 className="mt-4 font-serif text-xl font-semibold text-ink">Cómo gestionar tu elección</h2>
        <p>
          Puedes aceptar o rechazar las cookies opcionales en el aviso que aparece al entrar. También
          puedes borrar las cookies desde la configuración de tu navegador en cualquier momento.
        </p>

        <p className="mt-6 text-sm text-ink-3">
          Documento orientativo. El texto legal definitivo debe revisarse según la normativa aplicable
          (RGPD / LSSI-CE).
        </p>
      </div>
    </main>
  );
}
