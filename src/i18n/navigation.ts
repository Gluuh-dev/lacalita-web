import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Usar SIEMPRE estos en vez de next/link y next/navigation: añaden el prefijo de idioma.
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
