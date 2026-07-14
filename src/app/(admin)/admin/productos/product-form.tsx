'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {card, btn, btnGhost} from '@/components/admin/ui';
import FormFooter from '@/components/admin/form-footer';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import HeroMedia from '@/components/admin/hero-media';
import {I18nField} from '@/components/admin/i18n-field';
import AllergenIcon from '@/components/allergen-icon';
import {tx} from '@/lib/localize';
import {slugify} from '@/lib/slug';
import {saveProduct} from './actions';
import type {Product, Menu, Allergen} from '@/lib/queries';

type MenuWithCats = Pick<Menu, 'id' | 'name'> & {
  categories: {id: string; name: Record<string, string>}[];
};

export default function ProductForm({
  id,
  product,
  menus,
  allergens,
  cartaSlug
}: {
  id: string | null;
  product: Product | null;
  menus: MenuWithCats[];
  allergens: Allergen[];
  cartaSlug?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const backHref = cartaSlug ? `/admin/productos/${cartaSlug}` : '/admin/productos';
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? menus[0]?.categories[0]?.id ?? ''
  );
  const [image, setImage] = useState<string | null>(product?.image ?? null);
  const [video, setVideo] = useState<string | null>(product?.video ?? null);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [tag, setTag] = useState(product?.tag ?? '');
  const [ingredients, setIngredients] = useState<string[]>(product?.ingredients ?? []);
  const [ingInput, setIngInput] = useState('');
  const [available, setAvailable] = useState(product?.available ?? true);
  const [oldPrice, setOldPrice] = useState(product?.old_price != null ? String(product.old_price) : '');
  const [votes, setVotes] = useState(product?.votes != null ? String(product.votes) : '');
  const [rating, setRating] = useState(product?.rating != null ? String(product.rating) : '');

  function commitIngredients(raw: string) {
    const parts = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) setIngredients((a) => [...a, ...parts]);
    setIngInput('');
  }
  const [variants, setVariants] = useState<{name: string; price: string}[]>(
    (product?.product_variants ?? []).map((v) => ({
      name: v.name?.es ?? '',
      price: String(v.price)
    }))
  );
  const [allergenIds, setAllergenIds] = useState<string[]>(
    (product?.product_allergens ?? [])
      .map((pa) => pa.allergens?.id)
      .filter(Boolean) as string[]
  );
  const [name, setName] = useState<Record<string, string>>(product?.name ?? {es: ''});
  const [description, setDescription] = useState<Record<string, string>>(product?.description ?? {es: ''});
  const [f, setF] = useState({
    slug: product?.slug ?? '',
    price: product?.price != null ? String(product.price) : '',
    position: String(product?.position ?? 0)
  });

  const toggleAllergen = (aid: string) =>
    setAllergenIds((prev) =>
      prev.includes(aid) ? prev.filter((x) => x !== aid) : [...prev, aid]
    );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    doSave();
  }
  function doSave() {
    if (!categoryId) {
      toast.error('Elige una categoría');
      return;
    }
    if (!name.es?.trim()) {
      toast.error('Pon el nombre (es)');
      return;
    }
    const cleanVariants = variants
      .filter((v) => v.name.trim() && v.price !== '')
      .map((v) => ({name: v.name, price: Number(v.price)}));

    start(async () => {
      const r = await saveProduct(id, {
        category_id: categoryId,
        slug: f.slug || slugify(name.es),
        name,
        description,
        price: f.price === '' ? null : Number(f.price),
        image,
        video,
        featured,
        is_new: isNew,
        tag: tag.trim() || null,
        ingredients,
        available,
        position: Number(f.position) || 0,
        old_price: oldPrice === '' ? null : Number(oldPrice),
        votes: Number(votes) || 0,
        rating: rating === '' ? null : Number(rating),
        variants: cleanVariants,
        allergenIds
      });
      if (r.ok) {
        toast.success('Guardado');
        router.push(backHref);
        router.refresh();
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 pb-24">
      <div>
        <Label>Categoría</Label>
        <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface p-3">
          {menus.map((m) => (
            <div key={m.id}>
              {menus.length > 1 && <div className="mb-1.5 font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">{tx(m.name, 'es')}</div>}
              <div className="flex flex-wrap gap-2">
                {m.categories.map((c) => {
                  const on = categoryId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${on ? 'border-brand bg-brand/10 font-medium text-brand-deep' : 'border-line text-ink-2 hover:border-brand'}`}
                    >
                      {tx(c.name, 'es')}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <I18nField label="Nombre" value={name} onChange={setName} placeholder="La Doble Calita" />

      <I18nField label="Descripción" value={description} onChange={setDescription} textarea placeholder="Doble carne, cheddar y bacon ahumado." />

      <div>
        <Label>Ingredientes (escribe y pulsa coma o Enter para añadir otro)</Label>
        <div className="flex flex-wrap items-center gap-2 rounded-[14px] border border-line bg-surface p-2">
          {ingredients.map((ing, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2.5 py-1 text-sm">
              {ing}
              <button type="button" onClick={() => setIngredients((a) => a.filter((_, j) => j !== i))} aria-label="Quitar" className="text-ink-3 hover:text-danger">
                ✕
              </button>
            </span>
          ))}
          <input
            value={ingInput}
            onChange={(e) => {
              if (e.target.value.includes(',')) commitIngredients(e.target.value);
              else setIngInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                commitIngredients(ingInput);
              } else if (e.key === 'Backspace' && !ingInput && ingredients.length) {
                setIngredients((a) => a.slice(0, -1));
              }
            }}
            onBlur={() => ingInput.trim() && commitIngredients(ingInput)}
            placeholder={ingredients.length ? 'Otro…' : 'Ternera, cheddar, lechuga…'}
            className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
          />
        </div>
        <p className="mt-1 text-xs text-ink-3">Aparte de la descripción. Ej. para hamburguesas: lo que lleva.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Precio (€){variants.length > 0 && ' · usa variantes'}</Label>
          <Input
            type="number"
            step="0.01"
            value={f.price}
            onChange={(e) => setF({...f, price: e.target.value})}
            disabled={variants.length > 0}
            placeholder={variants.length > 0 ? 'según variante' : ''}
          />
        </div>
        <div>
          <Label>Posición</Label>
          <Input
            type="number"
            value={f.position}
            onChange={(e) => setF({...f, position: e.target.value})}
          />
        </div>
      </div>

      <div className="rounded-[14px] border border-line bg-surface p-3">
        <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">Hamburguesería · ofertas y favoritas</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label>Precio anterior (€)</Label>
            <Input type="number" step="0.01" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="tachado" />
          </div>
          <div>
            <Label>Votos (♥)</Label>
            <Input type="number" value={votes} onChange={(e) => setVotes(e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label>Valoración</Label>
            <Input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="0–5" />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-ink-3">Para la landing de la hamburguesería: precio tachado en ofertas, votos en “favoritas” y valoración (★).</p>
      </div>

      {/* Variantes */}
      <div className={`${card} space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Variantes (ej. Media / Entera)</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setVariants([...variants, {name: '', price: ''}])}
          >
            + Añadir
          </Button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder="Nombre"
              value={v.name}
              onChange={(e) => {
                const next = [...variants];
                next[i] = {...next[i], name: e.target.value};
                setVariants(next);
              }}
            />
            <Input
              className="w-28"
              type="number"
              step="0.01"
              placeholder="€"
              value={v.price}
              onChange={(e) => {
                const next = [...variants];
                next[i] = {...next[i], price: e.target.value};
                setVariants(next);
              }}
            />
            <button
              type="button"
              onClick={() => setVariants(variants.filter((_, j) => j !== i))}
              className="text-destructive"
              aria-label="Quitar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Alérgenos */}
      <div className={card}>
        <span className="mb-2 block text-sm font-medium">Alérgenos</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allergens.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={allergenIds.includes(a.id!)}
                onCheckedChange={() => toggleAllergen(a.id!)}
              />
              <AllergenIcon src={a.icon} label={tx(a.name, 'es')} size={20} />
              {tx(a.name, 'es')}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Imagen o vídeo (arrastra o pulsa · detecta el tipo)</Label>
        <HeroMedia
          media={video || image || ''}
          mediaType={video ? 'video' : 'image'}
          poster={video ? image ?? undefined : undefined}
          onSet={(m) => {
            if (m.mediaType === 'video') {
              setVideo(m.media);
              if (m.poster) setImage(m.poster);
            } else {
              setImage(m.media);
              setVideo(null);
            }
          }}
          onClear={() => {
            setVideo(null);
            setImage(null);
          }}
        />
      </div>

      <div>
        <Label>Etiqueta (opcional · ej. “2x1”, “En oferta”)</Label>
        <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Sobre todo para hamburguesas" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={featured} onCheckedChange={(v) => setFeatured(v === true)} />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={isNew} onCheckedChange={(v) => setIsNew(v === true)} />
          Nuevo
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={available} onCheckedChange={(v) => setAvailable(v === true)} />
          Disponible
        </label>
      </div>

      <FormFooter pending={pending} cancelHref={backHref} onSave={doSave} />
    </form>
  );
}
