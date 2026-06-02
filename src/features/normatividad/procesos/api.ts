import { fetcher } from "@/shared/api/fetcher"
import type { AgregarProcesoRequest, NormaProcesoResponse } from "../model/types"

export const agregarProcesoNorma = (
  normaId: number,
  body: AgregarProcesoRequest
): Promise<NormaProcesoResponse> =>
  fetcher(`/api/v1/normatividad/${normaId}/procesos`, {
    method: "POST",
    body: JSON.stringify(body),
  })

export const eliminarProcesoNorma = (procesoId: number): Promise<void> =>
  fetcher(`/api/v1/normatividad/procesos/${procesoId}/eliminar`, { method: "POST" })
