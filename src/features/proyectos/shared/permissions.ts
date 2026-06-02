// shared/permissions.ts
// Hooks de permisos para el dominio Proyectos.
// Todos leen roles del authStore (Zustand) — nunca del servidor.

import { useAuthStore } from "@/shared/state/auth.store"

type RoleSelector = (state: { roles: string[] }) => string[]

function useRoles(): string[] {
  return (useAuthStore as (sel: RoleSelector) => string[])((s) => s.roles) ?? []
}

export function useCanEditarPresupuesto(): boolean {
  const roles = useRoles()
  return roles.some((r) =>
    ["COORDINADOR", "FINANCIERO", "ADMIN_CENTRAL", "SUPERADMIN"].includes(r),
  )
}

export function useCanAprobarDecano(): boolean {
  const roles = useRoles()
  return roles.some((r) => ["DECANO", "SUPERADMIN"].includes(r))
}

export function useCanAprobarPlaneacion(): boolean {
  const roles = useRoles()
  return roles.some((r) => ["ADMIN_CENTRAL", "SUPERADMIN"].includes(r))
}

export function useCanConsolidar(): boolean {
  const roles = useRoles()
  return roles.some((r) => ["ADMIN_CENTRAL", "SUPERADMIN"].includes(r))
}

export function useCanAnularProyecto(estadoProyecto: string): boolean {
  const roles = useRoles()
  const puedeRol = roles.some((r) =>
    ["COORDINADOR", "ADMIN_CENTRAL", "SUPERADMIN"].includes(r),
  )
  const estadoPermitido = ["ACTIVO", "BORRADOR"].includes(estadoProyecto)
  return puedeRol && estadoPermitido
}

export function useCanGestionarContratos(): boolean {
  const roles = useRoles()
  return roles.some((r) =>
    ["COORDINADOR", "FINANCIERO", "ADMIN_CENTRAL", "SUPERADMIN"].includes(r),
  )
}
