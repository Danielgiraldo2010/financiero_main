import { fetcher } from '@/shared/api/fetcher'

export interface ConciliacionNomina {
  id:               number
  vigencia:         number
  mes:              number
  nombreMes:        string
  proyectoId:       number
  proyectoNombre:   string
  unidadEjecutoraId: number
  totalProyectado:  number
  totalLiquidadoGH: number
  diferencia:       number
  estadoDiferencia: string   // p.ej. 'SIN_DIFERENCIA' | 'DIFERENCIA_MENOR' | 'DIFERENCIA_MAYOR'
  estado:           string
  observaciones:    string | null
  requiereAjusteCdp: boolean
  cdpAjusteId:      number | null
}

export interface IniciarConciliacionPayload {
  vigencia:         number
  mes:              number
  proyectoId:       number
  unidadEjecutoraId: number
}

export async function iniciarConciliacionNomina(
  payload: IniciarConciliacionPayload,
): Promise<ConciliacionNomina> {
  return fetcher('/api/v1/nomina/conciliacion', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
