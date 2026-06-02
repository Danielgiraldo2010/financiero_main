import type { EstadoPresupuesto } from '@/shared/lib/constants'

export type TipoProyecto = 'INVESTIGACION' | 'EXTENSION' | 'CONVENIO' | 'VENTA_SERVICIOS' | 'OTROS'

export interface Proyecto {
  id: number
  codigo: string
  nombre: string
  tipo: TipoProyecto
  estado: EstadoPresupuesto
  unidadEjecutoraId: number
  vigencia: number
  fechaInicio: string
  fechaFin?: string
  createdAt: string
  updatedAt: string
}
