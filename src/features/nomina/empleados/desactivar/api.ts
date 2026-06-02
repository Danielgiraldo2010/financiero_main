import { fetcher } from '@/shared/api/fetcher'

// DesactivarEmpleadoCommand real: id + fechaRetiro (date ISO)
export interface DesactivarEmpleadoPayload {
  fechaRetiro: string   // date ISO "YYYY-MM-DD"
}

export async function desactivarEmpleado(
  id: number,
  payload: DesactivarEmpleadoPayload,
): Promise<void> {
  return fetcher(`/api/v1/nomina/empleados/${id}/desactivar`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload }),
  })
}
