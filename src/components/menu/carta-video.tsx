'use client';

import {useRouter} from '@/i18n/navigation';
import {VideoReels} from '@/components/menu/menu-tabbar';
import type {MenuItem} from '@/components/menu/store';

export default function CartaVideo({videos, locale}: {videos: MenuItem[]; locale: string}) {
  const router = useRouter();
  return <VideoReels asPage videos={videos} locale={locale} onClose={() => router.back()} />;
}
