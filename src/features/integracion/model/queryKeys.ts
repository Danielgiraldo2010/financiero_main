// features/integracion/model/queryKeys.ts

export const integracionKeys = {
  all: ["integracion"] as const,

  sistemas: () => [...integracionKeys.all, "sistemas"] as const,
  sistema: (id: number) => [...integracionKeys.sistemas(), id] as const,

  sincronizaciones: () => [...integracionKeys.all, "sincronizaciones"] as const,
  sincronizacion: (id: number) => [...integracionKeys.sincronizaciones(), id] as const,
}