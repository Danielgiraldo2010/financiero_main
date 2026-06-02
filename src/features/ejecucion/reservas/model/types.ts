// features/ejecucion/reservas/model/types.ts
// Fuente: OpenAPI — ReservaPresupuestalResponse, RegistrarReservaCommand,
//         EjecutarReservaCommand, AnularReservaCommand

export type EstadoReserva = 'ACTIVA' | 'EJECUTADA' | 'ANULADA';

export interface ReservaPresupuestalResponse {
  id: number;
  numero: string;
  tipo: string;
  vigenciaOrigen: number;
  vigenciaDestino: number;
  unidadEjecutoraId: number;
  unidadEjecutoraNombre: string;
  rubroGastoId: number;
  rubroGastoNombre: string;
  valor: number;
  valorEjecutado: number;
  saldo: number;
  beneficiario: string | null;
  estado: EstadoReserva;
}

/**
 * POST /api/v1/ejecucion/reservas
 * cdpId y registroPresupuestalId son OPCIONALES según OpenAPI (nullable).
 */
export interface RegistrarReservaCommand {
  tipo: string;
  vigenciaOrigen: number;
  vigenciaDestino: number;
  unidadEjecutoraId: number;
  cdpId?: number | null;
  registroPresupuestalId?: number | null;
  rubroGastoId: number;
  fuenteRecursoId: number;
  valor: number;
  beneficiario?: string | null;
  concepto?: string | null;
  justificacion?: string | null;
  urlDocumento?: string | null;
}

/**
 * POST /api/v1/ejecucion/reservas/{id}/ejecutar
 * NOTA: requiere valorEjecutar además del id — NO es un toggle simple.
 */
export interface EjecutarReservaCommand {
  id: number;
  valorEjecutar: number;
}

/** POST /api/v1/ejecucion/reservas/{id}/anular */
export interface AnularReservaCommand {
  id: number;
  motivo: string;
}
