// Iconos propios de la carta (siluetas negras rellenas). Se pintan como máscara,
// así toman currentColor y siguen el color de cada carta y el estado del chip.
export default function MaskIcon({src, className = 'size-4'}: {src: string; className?: string}) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center'
      }}
    />
  );
}
