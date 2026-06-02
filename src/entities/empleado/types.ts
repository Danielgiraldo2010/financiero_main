export type TipoEmpleado =
  | 'DOCENTE_PLANTA'
  | 'DOCENTE_CATEDRA'
  | 'ADMINISTRATIVO'
  | 'CONTRATISTA'

export interface Empleado {
  id: number
  cedula: string
  nombre: string
  apellido: string
  email?: string
  tipo: TipoEmpleado
  activo: boolean
}
