'use client';

import {useRouter} from 'next/navigation';
import {VideoReels} from '@/components/menu/menu-tabbar';
import type {MenuItem} from '@/components/menu/store';

export default function BurgerVideo({videos, locale}: {videos: MenuItem[]; locale: string}) {
  const router = useRouter();
  return <VideoReels videos={videos} locale={locale} asPage onClose={() => router.back()} />;
}
