'use client';

import {useEffect} from 'react';
import {useMenuStore, type MenuItem} from '@/components/menu/store';

// Carga los vídeos de la hamburguesería en el store para que el modal de vídeo (global)
// funcione desde cualquier página.
export default function BurgerData({videos}: {videos: MenuItem[]}) {
  const setVideos = useMenuStore().setVideos;
  useEffect(() => {
    setVideos(videos);
  }, [videos, setVideos]);
  return null;
}
