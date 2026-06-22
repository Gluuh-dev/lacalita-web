'use client';

import {useState} from 'react';
import {Languages, Plus, Loader2} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';

export type I18n = Record<string, string>;

const SECONDARY = ['en', 'fr'] as const;
const LABEL: Record<string, string> = {es: 'Español', en: 'Inglés', fr: 'Francés'};

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
  const [open, setOpen] = useState<string[]>(SECONDARY.filter((l) => v[l]?.trim()));
  const [busy, setBusy] = useState<string | null>(null);
  const Ctl = textarea ? Textarea : Input;

  const shown = SECONDARY.filter((l) => open.includes(l));
  const addable = SECONDARY.filter((l) => !shown.includes(l));

  async function translate(lang: string) {
    if (!v.es?.trim()) return;
    setBusy(lang);
    try {
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: v.es, to: lang})
      });
      const j = await r.json();
      onChange({...v, [lang]: j.text ?? ''});
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <Ctl value={v.es ?? ''} onChange={(e) => onChange({...v, es: e.target.value})} placeholder={placeholder} />
      {shown.map((lang) => (
        <div key={lang} className="mt-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-ink-3">{LABEL[lang]}</span>
            <button
              type="button"
              onClick={() => translate(lang)}
              disabled={busy === lang || !v.es?.trim()}
              className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs text-ink-2 transition hover:border-brand disabled:opacity-50"
            >
              {busy === lang ? <Loader2 className="size-3 animate-spin" /> : <Languages className="size-3" />} Traducir desde ES
            </button>
          </div>
          <Ctl value={v[lang] ?? ''} onChange={(e) => onChange({...v, [lang]: e.target.value})} placeholder={`(${LABEL[lang]})`} />
        </div>
      ))}
      {addable.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {addable.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setOpen([...open, lang])}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-line-strong px-3 py-1 text-xs text-ink-2 transition hover:border-brand"
            >
              <Plus className="size-3" /> Añadir {LABEL[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
