import { useQuery } from "@tanstack/react-query"
import { rolesKeys } from "../model/queryKeys"
import { fetchRoles } from "./api"

export function useRoles() {
  return useQuery({
    queryKey: rolesKeys.lists(),
    queryFn: fetchRoles,
  })
}
