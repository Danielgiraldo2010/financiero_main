import { fetcher } from "@/shared/api/fetcher"
import type { Rol } from "../model/types"

export async function fetchRoles(): Promise<Rol[]> {
  return fetcher<Rol[]>("/api/v1/admin/roles")
}
