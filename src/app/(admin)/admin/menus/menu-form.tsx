'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import MediaUpload from '@/components/admin/media-upload';
import FormFooter from '@/components/admin/form-footer';
import {slugify} from '@/lib/slug';
import {saveMenu} from './actions';
import type {Menu} from '@/lib/queries';

export default function MenuForm({
  id,
  menu,
  onSaved
}: {
  id: string | null;
  menu: Menu | null;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [image, setImage] = useState<string | null>(menu?.header_image ?? null);
  const [video, setVideo] = useState<string | null>(menu?.header_video ?? null);
  const [theme, setTheme] = useState(menu?.theme ?? 'calita');
  const [f, setF] = useState({
    slug: menu?.slug ?? '',
    name: menu?.name?.es ?? '',
    subtitle: menu?.subtitle?.es ?? '',
    position: String(menu?.position ?? 0)
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({...f, [k]: e.target.value});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveMenu(id, {
        slug: f.slug || slugify(f.name),
        name: f.name,
        subtitle: f.subtitle,
        theme,
        header_image: image,
        header_video: video,
        position: Number(f.position) || 0
      });
      if (r.ok) {
        toast.success('Guardado');
        router.refresh();
        if (onSaved) onSaved();
        else router.push('/admin/menus');
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Nombre (es)</Label>
        <Input value={f.name} onChange={set('name')} required />
      </div>
      <div>
        <Label>Subtítulo (es)</Label>
        <Input value={f.subtitle} onChange={set('subtitle')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Slug (URL)</Label>
          <Input value={f.slug} onChange={set('slug')} placeholder="auto" />
        </div>
        <div>
          <Label>Tema</Label>
          <Select value={theme} onValueChange={(v) => setTheme(v ?? 'calita')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calita">Calita (playa)</SelectItem>
              <SelectItem value="burger">Burger (oscuro)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Posición</Label>
        <Input type="number" value={f.position} onChange={set('position')} />
      </div>
      <div>
        <Label>Imagen de cabecera</Label>
        <MediaUpload value={image} onChange={setImage} />
      </div>
      <div>
        <Label>Vídeo de cabecera</Label>
        <MediaUpload kind="video" value={video} onChange={setVideo} />
      </div>
      <FormFooter pending={pending} onCancel={onSaved} />
    </form>
  );
}
