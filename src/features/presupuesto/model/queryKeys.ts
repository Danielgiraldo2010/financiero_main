// features/presupuesto/model/queryKeys.ts
// Factory de query keys — jerarquía estándar [dominio, sub, params]

export const presupuestoKeys = {
  all: ['presupuesto'] as const,

  ingresos: {
    all: () => [...presupuestoKeys.all, 'ingresos'] as const,
    list: (params?: object) =>
      [...presupuestoKeys.ingresos.all(), 'list', params ?? {}] as const,
  },

  gastos: {
    all: () => [...presupuestoKeys.all, 'gastos'] as const,
    list: (params?: object) =>
      [...presupuestoKeys.gastos.all(), 'list', params ?? {}] as const,
  },

  resumen: {
    all: () => [...presupuestoKeys.all, 'resumen'] as const,
    byVigencia: (vigencia?: number) =>
      [...presupuestoKeys.resumen.all(), { vigencia }] as const,
  },

  techo: {
    all: () => [...presupuestoKeys.all, 'techo'] as const,
    byVigencia: (vigencia?: number) =>
      [...presupuestoKeys.techo.all(), { vigencia }] as const,
  },

  etapas: {
    all: () => [...presupuestoKeys.all, 'etapas'] as const,
    byVigencia: (vigencia?: number) =>
      [...presupuestoKeys.etapas.all(), { vigencia }] as const,
  },

  ejecucionMensual: {
    all: () => [...presupuestoKeys.all, 'ejecucion-mensual'] as const,
    byParams: (params?: object) =>
      [...presupuestoKeys.ejecucionMensual.all(), params ?? {}] as const,
  },
} as const;
