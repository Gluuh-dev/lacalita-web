// Icono de alérgeno (PNG en public/allergens/). Sirve en server y client.
export default function AllergenIcon({
  src,
  label,
  size = 22
}: {
  src: string;
  label: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      title={label}
      width={size}
      height={size}
      className="inline-block shrink-0 object-contain"
      style={{width: size, height: size}}
    />
  );
}
