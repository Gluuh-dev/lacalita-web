'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {tx} from '@/lib/localize';
import {saveCategory} from './actions';
import type {Category, Menu} from '@/lib/queries';

export default function CategoryForm({
  id,
  category,
  menus,
  onSaved
}: {
  id: string | null;
  category: Category | null;
  menus: Pick<Menu, 'id' | 'name'>[];
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [menuId, setMenuId] = useState(category?.menu_id ?? menus[0]?.id ?? '');
  const [visible, setVisible] = useState(category?.visible ?? true);
  const [f, setF] = useState({
    name: category?.name?.es ?? '',
    description: category?.description?.es ?? '',
    position: String(category?.position ?? 0)
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({...f, [k]: e.target.value});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveCategory(id, {
        menu_id: menuId,
        name: f.name,
        description: f.description,
        position: Number(f.position) || 0,
        visible
      });
      if (r.ok) {
        toast.success('Guardado');
        router.refresh();
        if (onSaved) onSaved();
        else router.push('/admin/categorias');
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Carta</Label>
        <Select value={menuId} onValueChange={(v) => setMenuId(v ?? '')}>
          <SelectTrigger>
            <SelectValue placeholder="Elige carta" />
          </SelectTrigger>
          <SelectContent>
            {menus.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {tx(m.name, 'es')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Nombre (es)</Label>
        <Input value={f.name} onChange={set('name')} required />
      </div>
      <div>
        <Label>Descripción (es)</Label>
        <Input value={f.description} onChange={set('description')} />
      </div>
      <div className="flex items-center gap-6">
        <div>
          <Label>Posición</Label>
          <Input className="w-24" type="number" value={f.position} onChange={set('position')} />
        </div>
        <label className="flex items-center gap-2 pt-5 text-sm">
          <Checkbox checked={visible} onCheckedChange={(v) => setVisible(v === true)} />
          Visible
        </label>
      </div>
      <Button type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar'}</Button>
    </form>
  );
}
