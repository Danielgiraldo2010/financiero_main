import type { EstadoPresupuesto } from '@/shared/lib/constants'

export interface LineaPresupuestal {
  id: number
  codigo: string
  nombre: string
  rubro: string
}

export interface PresupuestoItem {
  id: number
  proyectoId: number
  lineaPresupuestal: LineaPresupuestal
  vigencia: number
  valorInicial: number
  valorModificaciones: number
  valorFinal: number
  valorEjecutado: number
  saldo: number
  estado: EstadoPresupuesto
}

export interface ResumenPresupuestal {
  proyectoId: number
  vigencia: number
  totalInicial: number
  totalModificaciones: number
  totalFinal: number
  totalEjecutado: number
  saldo: number
  porcentajeEjecucion: number
}
