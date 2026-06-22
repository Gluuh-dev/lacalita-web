// Compresión de imágenes en el navegador con canvas (sin dependencias).
// Redimensiona a maxDim y re-codifica a WebP calidad alta. Respeta la
// orientación EXIF (fotos de móvil). ponytail: vídeos NO se comprimen aquí
// (demasiado pesado en cliente); migrar a Mux/Cloudflare si el peso lo pide.
export async function compressImage(
  file: File,
  maxDim = 2000,
  quality = 0.85
): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, {imageOrientation: 'from-image'});
  } catch {
    return file;
  }

  let {width, height} = bitmap;
  const max = Math.max(width, height);
  if (max > maxDim) {
    const s = maxDim / max;
    width = Math.round(width * s);
    height = Math.round(height * s);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob: Blob | null = await new Promise((res) =>
    canvas.toBlob(res, 'image/webp', quality)
  );
  return blob ?? file;
}

// Captura el primer fotograma de un vídeo como imagen (poster) para mostrar algo
// al instante mientras el vídeo carga.
export async function captureVideoPoster(file: File): Promise<Blob | null> {
  if (!file.type.startsWith('video/')) return null;
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;
    const done = (b: Blob | null) => {
      URL.revokeObjectURL(url);
      resolve(b);
    };
    video.onloadeddata = () => {
      try {
        video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
      } catch {
        /* algunos navegadores no permiten seek inmediato */
      }
    };
    video.onseeked = () => {
      let {videoWidth: w, videoHeight: h} = video;
      const max = 1280;
      if (Math.max(w, h) > max) {
        const s = max / Math.max(w, h);
        w = Math.round(w * s);
        h = Math.round(h * s);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return done(null);
      ctx.drawImage(video, 0, 0, w, h);
      canvas.toBlob((b) => done(b), 'image/webp', 0.8);
    };
    video.onerror = () => done(null);
  });
}
