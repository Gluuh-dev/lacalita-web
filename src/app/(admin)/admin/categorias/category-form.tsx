'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import FormFooter from '@/components/admin/form-footer';
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
  const [role, setRole] = useState(category?.role ?? 'normal');
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
        visible,
        role
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
      <div>
        <Label>Cómo se muestra esta categoría</Label>
        <Select value={role} onValueChange={(v) => setRole(v ?? 'normal')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal (categoría corriente)</SelectItem>
            <SelectItem value="base">Base — los productos son la base (panes)</SelectItem>
            <SelectItem value="topping">Relleno — se suma a la base (toppings)</SelectItem>
            <SelectItem value="carousel">Carrusel — tarros/fotos en fila (salsas)</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-ink-3">Con una categoría «base» y otra «relleno» en la misma carta, la web muestra el configurador arriba.</p>
      </div>
      <FormFooter pending={pending} onCancel={onSaved} />
    </form>
  );
}
