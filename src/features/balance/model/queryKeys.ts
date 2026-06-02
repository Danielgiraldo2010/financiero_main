export const balanceKeys = {
  all: ['balance'] as const,

  // Cierre
  cierres: () => [...balanceKeys.all, 'cierre'] as const,
  cierre: (id: number) => [...balanceKeys.cierres(), id] as const,

  // Recursos
  recursos: (vigencia?: number) => [...balanceKeys.all, 'recursos', vigencia] as const,
  recurso: (id: number) => [...balanceKeys.all, 'recursos', id] as const,

  // Conciliacion
  conciliaciones: () => [...balanceKeys.all, 'conciliacion'] as const,
  conciliacionDiferencias: () => [...balanceKeys.all, 'conciliacion', 'diferencias'] as const,

  // Recaudos
  recaudos: (vigencia?: number) => [...balanceKeys.all, 'recaudos', vigencia] as const,
  recaudo: (id: number) => [...balanceKeys.all, 'recaudos', id] as const,

  // Flujo de caja
  flujoCajaMensual: (vigencia: number, mes: number) =>
    [...balanceKeys.all, 'flujo-caja', 'mensual', vigencia, mes] as const,
  flujoCajaAnual: (vigencia: number) =>
    [...balanceKeys.all, 'flujo-caja', 'anual', vigencia] as const,
}
