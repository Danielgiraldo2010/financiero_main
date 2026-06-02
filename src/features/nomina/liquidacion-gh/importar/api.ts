import { fetcher } from '@/shared/api/fetcher'

export interface LineaLiquidacionGH {
  empleadoId:        number
  tipoNomina:        string
  horasLiquidadas:   number
  valorHora:         number
  valorBase:         number
  valorSalud:        number
  valorPension:      number
  valorArl:          number
  valorParafiscales: number
  valorPrestaciones: number
}

export interface ImportarLiquidacionPayload {
  vigencia:      number
  mes:           number
  proyectoId:    number
  origenArchivo: string   // nombre del archivo original
  lineas:        LineaLiquidacionGH[]
}

export interface ImportacionResult {
  lineasImportadas: number
  lineasError:      number
  mensaje:          string
}

// El endpoint recibe JSON — el parsing CSV/XLSX ocurre en cliente
export async function importarLiquidacionGH(
  payload: ImportarLiquidacionPayload,
): Promise<ImportacionResult> {
  return fetcher('/api/v1/nomina/liquidacion-gh/importar', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
