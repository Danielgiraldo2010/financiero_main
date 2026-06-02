import type { ListarNormasParams } from "./types"

export const normatividadKeys = {
  all: ["normatividad"] as const,
  lista: (params?: ListarNormasParams) =>
    [...normatividadKeys.all, "lista", params] as const,
  detalle: (id: number) => [...normatividadKeys.all, id] as const,
  porDominio: (dominio: string) =>
    [...normatividadKeys.all, "por-dominio", dominio] as const,
}
