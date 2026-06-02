import { fetcher } from '@/shared/api/fetcher'
import type { PuntoSalarial } from '../model/types'

// Alineado con RegistrarPuntosCommand del OpenAPI real
export interface RegistrarPuntosPayload {
  vigencia:        number
  decretoNorma:    string
  categoria:       string
  nivel:           number
  puntosBase:      number
  valorPunto:      number
  factorCategoria: number
  vigenteDesde:    string   // date ISO
  vigenteHasta:    string | null
}

export async function registrarPuntosSalariales(
  payload: RegistrarPuntosPayload,
): Promise<PuntoSalarial> {
  return fetcher('/api/v1/nomina/puntos-salariales', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
