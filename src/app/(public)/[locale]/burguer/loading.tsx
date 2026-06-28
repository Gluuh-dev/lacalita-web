// Skeleton de la landing de hamburguesería: aparece al instante al navegar a Inicio
// (el navbar y el tabbar ya viven en el layout, así que solo carga el contenido).
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fdfbf7]">
      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-6 pb-32 pt-24 md:grid-cols-2">
        {/* Columna texto */}
        <div className="flex animate-pulse flex-col items-center gap-4 md:items-start">
          <div className="h-9 w-40 rounded-lg bg-[#ece0cd]" />
          <div className="mt-1 h-3 w-52 rounded-full bg-[#ece0cd]" />
          <div className="h-3 w-72 max-w-full rounded-full bg-[#ece0cd]" />
          <div className="h-3 w-60 max-w-full rounded-full bg-[#ece0cd]" />
          <div className="mt-3 hidden gap-3 md:flex">
            <div className="h-11 w-36 rounded-full bg-[#ece0cd]" />
            <div className="h-11 w-32 rounded-full bg-[#e7d8c4]" />
          </div>
        </div>

        {/* Imagen burger */}
        <div className="flex animate-pulse justify-center">
          <div className="aspect-square w-[78%] max-w-sm rounded-[36px] bg-[#ece0cd] md:w-full" />
        </div>
      </div>

      {/* Paginador */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 flex animate-pulse justify-center gap-2.5 md:hidden">
        <div className="h-10 w-40 rounded-full bg-[#ece0cd]" />
        <div className="size-10 rounded-full bg-[#ece0cd]" />
      </div>
    </main>
  );
}
