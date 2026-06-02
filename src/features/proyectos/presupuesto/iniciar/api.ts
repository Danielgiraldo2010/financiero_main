// iniciar/api.ts
// POST /api/v1/proyectos/{id}/presupuesto
// Inicia el borrador de presupuesto para un proyecto.
// Body: { vigencia: number }

import { fetcher } from "@/shared/api/fetcher"
import type { PresupuestoProyecto } from "../model/types"

export interface IniciarBorradorPayload {
  vigencia: number
}

export async function iniciarBorrador(
  proyectoId: number,
  payload: IniciarBorradorPayload,
): Promise<PresupuestoProyecto> {
  return fetcher<PresupuestoProyecto>(
    `/api/v1/proyectos/${proyectoId}/presupuesto`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
}
