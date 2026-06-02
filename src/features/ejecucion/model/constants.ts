// features/ejecucion/model/constants.ts
import type { EstadoCDP, EstadoRP } from './types';

export const ESTADOS_CDP: Record<EstadoCDP, { label: string; color: string }> = {
  ACTIVO:          { label: 'Activo',              color: 'green'  },
  COMPROMETIDO:    { label: 'Comprometido',         color: 'blue'   },
  AGOTADO:         { label: 'Agotado',              color: 'orange' },
  ANULADO:         { label: 'Anulado',              color: 'red'    },
};

export const ESTADOS_RP: Record<EstadoRP, { label: string; color: string }> = {
  ACTIVO:               { label: 'Activo',               color: 'green'  },
  PARCIALMENTE_PAGADO:  { label: 'Parcialmente Pagado',  color: 'blue'   },
  PAGADO:               { label: 'Pagado',               color: 'purple' },
  ANULADO:              { label: 'Anulado',              color: 'red'    },
};

/** Vigencias disponibles en los selectores (año actual ± 2). */
export const VIGENCIAS_DISPONIBLES: number[] = (() => {
  const year = new Date().getFullYear();
  return [year - 1, year, year + 1];
})();
