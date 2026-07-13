// Taza de café de la casa. Misma API que los iconos de Tabler (size, stroke,
// className) para poder intercambiarlos sin tocar quien los usa.
export default function IconCoffeeCup({
  size = 24,
  stroke = 2,
  className,
  style
}: {
  size?: number | string;
  stroke?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 16 20"
      width={size}
      height={size}
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1,12c.83.64,2.08,1.02,3.5,1,1.42.02,2.67-.36,3.5-1s2.08-1.02,3.5-1c1.42-.02,2.67.36,3.5,1" />
      <path d="M6,1c-.64.46-1.02,1.21-1,2-.02.79.36,1.54,1,2" />
      <path d="M10,1c-.64.46-1.02,1.21-1,2-.02.79.36,1.54,1,2" />
      <path d="M1,8h14v5c0,3.31-2.69,6-6,6h-2c-3.31,0-6-2.69-6-6v-5" />
    </svg>
  );
}
