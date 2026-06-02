import type { UsuariosParams } from "./types"

export const usuariosKeys = {
  all: ["usuarios"] as const,
  lists: () => [...usuariosKeys.all, "list"] as const,
  list: (params: UsuariosParams) => [...usuariosKeys.lists(), params] as const,
  details: () => [...usuariosKeys.all, "detail"] as const,
  detail: (id: string) => [...usuariosKeys.details(), id] as const,
} as const
