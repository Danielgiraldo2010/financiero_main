// features/ejecucion/model/queryKeys.ts
// Factory base para todas las query keys del módulo de ejecución.
export const ejecucionKeys = {
  all: ['ejecucion'] as const,
  cdp: () => [...ejecucionKeys.all, 'cdp'] as const,
  rp:  () => [...ejecucionKeys.all, 'rp']  as const,
} as const;
