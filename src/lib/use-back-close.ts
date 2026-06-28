'use client';

import {useEffect, useRef} from 'react';

/**
 * Hace que el botón "atrás" (Android / navegador) CIERRE el modal en vez de
 * salir de la página. Empuja una entrada de historial al abrir; al pulsar atrás
 * dispara onClose. Si se cierra de otra forma, limpia la entrada empujada.
 */
export function useBackClose(open: boolean, onClose: () => void) {
  const cb = useRef(onClose);
  cb.current = onClose;
  useEffect(() => {
    if (!open) return;
    window.history.pushState({modal: true}, '');
    const onPop = () => cb.current();
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      // Cerrado sin "atrás": quita la entrada que empujamos.
      if (window.history.state?.modal) window.history.back();
    };
    // onClose se lee por ref (cb), NO va en deps: si fuera, cada render del store
    // recrearía onClose, reiniciaría el efecto y el history.back() cerraría el modal.
  }, [open]);
}
