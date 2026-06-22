'use client';

import {useState} from 'react';
import {Languages, Loader2} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';

export type I18n = Record<string, string>;

const SECONDARY = ['en', 'fr'] as const;
const LABEL: Record<string, string> = {es: 'Español', en: 'Inglés', fr: 'Francés'};

async function translateOne(text: string, to: string): Promise<string> {
  const r = await fetch('/api/translate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text, to})
  });
  const j = await r.json();
  return j.text ?? '';
}

export function I18nField({
  label,
  value,
  onChange,
  textarea,
  placeholder
}: {
  label: string;
  value: I18n | null | undefined;
  onChange: (v: I18n) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const v = value ?? {};
  const [open, setOpen] = useState<boolean>(SECONDARY.some((l) => v[l]?.trim()));
  const [busy, setBusy] = useState(false);
  const Ctl = textarea ? Textarea : Input;
  const hasEs = !!v.es?.trim();

  async function generate() {
    if (!hasEs) return;
    setOpen(true);
    setBusy(true);
    try {
      const out: I18n = {...v};
      for (const lang of SECONDARY) out[lang] = await translateOne(v.es, lang);
      onChange(out);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <Label className="mb-0">{label}</Label>
        <button
          type="button"
          onClick={generate}
          disabled={!hasEs || busy}
          className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-2 transition hover:border-brand disabled:opacity-40"
        >
          {busy ? <Loader2 className="size-3 animate-spin" /> : <Languages className="size-3" />} Generar traducciones
        </button>
      </div>
      <Ctl value={v.es ?? ''} onChange={(e) => onChange({...v, es: e.target.value})} placeholder={placeholder} />

      {open ? (
        SECONDARY.map((lang) => (
          <div key={lang} className="mt-2">
            <div className="mb-1 text-xs font-medium text-ink-3">{LABEL[lang]}</div>
            <Ctl value={v[lang] ?? ''} onChange={(e) => onChange({...v, [lang]: e.target.value})} placeholder={`(${LABEL[lang]})`} />
          </div>
        ))
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="mt-1.5 text-xs text-ink-3 underline-offset-2 hover:underline">
          + Añadir otros idiomas
        </button>
      )}
    </div>
  );
}
