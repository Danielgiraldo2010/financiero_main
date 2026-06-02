import { fetcher } from '@/shared/api/fetcher'
import type { Empleado } from '../model/types'

export interface RegistrarEmpleadoPayload {
  tipoIdentificacion:   string
  numeroIdentificacion: string
  primerNombre:         string
  segundoNombre:        string | null
  primerApellido:       string
  segundoApellido:      string | null
  email:                string | null
  telefono:             string | null
  tipoEmpleado:         string
  cargo:                string | null
  salarioBaseMensual:   number
  programaAcademicoId:  number | null
  unidadEjecutoraId:    number
  fechaIngreso:         string | null   // date ISO
  urlContrato:          string | null
  categoriaDocente:     string | null
}

export async function registrarEmpleado(
  payload: RegistrarEmpleadoPayload,
): Promise<Empleado> {
  return fetcher('/api/v1/nomina/empleados', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
