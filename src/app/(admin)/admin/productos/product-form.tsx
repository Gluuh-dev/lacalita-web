'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {card} from '@/components/admin/ui';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import MediaUpload from '@/components/admin/media-upload';
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
  onSaved
}: {
  id: string | null;
  product: Product | null;
  menus: MenuWithCats[];
  allergens: Allergen[];
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? menus[0]?.categories[0]?.id ?? ''
  );
  const [image, setImage] = useState<string | null>(product?.image ?? null);
  const [video, setVideo] = useState<string | null>(product?.video ?? null);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [available, setAvailable] = useState(product?.available ?? true);
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
  const [f, setF] = useState({
    name: product?.name?.es ?? '',
    description: product?.description?.es ?? '',
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
    if (!categoryId) {
      toast.error('Elige una categoría');
      return;
    }
    const cleanVariants = variants
      .filter((v) => v.name.trim() && v.price !== '')
      .map((v) => ({name: v.name, price: Number(v.price)}));

    start(async () => {
      const r = await saveProduct(id, {
        category_id: categoryId,
        slug: f.slug || slugify(f.name),
        name: f.name,
        description: f.description,
        price: f.price === '' ? null : Number(f.price),
        image,
        video,
        featured,
        is_new: isNew,
        available,
        position: Number(f.position) || 0,
        variants: cleanVariants,
        allergenIds
      });
      if (r.ok) {
        toast.success('Guardado');
        router.refresh();
        if (onSaved) onSaved();
        else router.push('/admin/productos');
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Categoría</Label>
        <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? '')}>
          <SelectTrigger>
            <SelectValue placeholder="Elige categoría" />
          </SelectTrigger>
          <SelectContent>
            {menus.map((m) => (
              <SelectGroup key={m.id}>
                <SelectLabel>{tx(m.name, 'es')}</SelectLabel>
                {m.categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {tx(c.name, 'es')}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Nombre (es)</Label>
        <Input value={f.name} onChange={(e) => setF({...f, name: e.target.value})} required />
      </div>

      <div>
        <Label>Descripción (es)</Label>
        <Textarea
          rows={3}
          value={f.description}
          onChange={(e) => setF({...f, description: e.target.value})}
        />
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
        <Label>Imagen</Label>
        <MediaUpload value={image} onChange={setImage} />
      </div>
      <div>
        <Label>Vídeo</Label>
        <MediaUpload kind="video" value={video} onChange={setVideo} />
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

      <Button disabled={pending}>{pending ? 'Guardando…' : 'Guardar'}</Button>
    </form>
  );
}
