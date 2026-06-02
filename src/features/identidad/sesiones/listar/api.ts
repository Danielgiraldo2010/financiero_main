import { fetcher } from "@/shared/api/fetcher"
import type { Sesion } from "../model/types"

export async function fetchSesiones(): Promise<Sesion[]> {
  return fetcher<Sesion[]>("/api/v1/admin/sesiones")
}
