// src/features/identidad/roles/claims/hook.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { rolesKeys } from "../model/queryKeys"
import { asignarClaim, revocarClaim } from "./api"

export function useAsignarClaim(roleName: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (permission: string) =>
      asignarClaim({ roleName, permission }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(roleName) })
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() })
    },
  })
}

export function useRevocarClaim(roleName: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (permission: string) => revocarClaim(roleName, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(roleName) })
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() })
    },
  })
}
