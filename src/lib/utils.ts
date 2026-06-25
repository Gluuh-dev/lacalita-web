import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** ¿La URL es un vídeo? (para usar <video> en vez de <img>). */
export function isVideoUrl(u?: string | null): boolean {
  return !!u && (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u) || u.includes('/video/'));
}
