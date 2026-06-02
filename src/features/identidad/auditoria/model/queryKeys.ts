import type { AuditoriaParams } from "./types"

export const auditoriaKeys = {
  all: ["auditoria"] as const,
  lists: () => [...auditoriaKeys.all, "list"] as const,
  list: (params: AuditoriaParams) => [...auditoriaKeys.lists(), params] as const,
  detail: (id: number) => [...auditoriaKeys.all, "detail", id] as const,
} as const
