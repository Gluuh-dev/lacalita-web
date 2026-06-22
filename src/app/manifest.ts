import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'La Calita Beach Club',
    short_name: 'La Calita',
    description: 'Carta digital de La Calita Beach Club — Salobreña.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6ef',
    theme_color: '#e9ae74',
    icons: [
      {src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any'}
    ]
  };
}
