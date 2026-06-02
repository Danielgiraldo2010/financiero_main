// features/ejecucion/avances/model/types.ts
// Fuente: OpenAPI — AvanceLegalizacionResponse, RegistrarAvanceCommand, LegalizarAvanceCommand

export type EstadoAvance = 'PENDIENTE' | 'LEGALIZADO' | 'VENCIDO';

export interface AvanceLegalizacionResponse {
  id: number;
  numero: string;
  tipo: string;
  vigencia: number;
  beneficiario: string;
  concepto: string;
  rubroGastoNombre: string;
  valorAvance: number;
  valorLegalizado: number;
  valorReintegro: number;
  fechaAvance: string | null;          // ISO date-time
  fechaLimiteLegal: string | null;     // ISO date-time
  fechaLegalizacion: string | null;    // ISO date-time
  estado: EstadoAvance;
  diasParaVencimiento: number | null;  // null cuando ya está legalizado
}

/**
 * POST /api/v1/ejecucion/avances
 * fechaAvance y fechaLimiteLegal son ISO date-time REQUERIDOS.
 */
export interface RegistrarAvanceCommand {
  vigencia: number;
  unidadEjecutoraId: number;
  beneficiario: string;
  nitCedula?: string | null;
  concepto: string;
  rubroGastoId: number;
  fuenteRecursoId: number;
  cdpId?: number | null;
  valorAvance: number;
  fechaAvance: string;                 // ISO date-time requerido
  fechaLimiteLegal: string;            // ISO date-time requerido
  urlDocumentoAvance?: string | null;
  observaciones?: string | null;
}

/**
 * POST /api/v1/ejecucion/avances/{id}/legalizar
 * INVARIANTE 09b-I4: urlDocumentoLegalizacion + observaciones según schema real.
 * (El plan mencionaba DocumentosPanel previo pero el schema usa campo de URL directo.)
 */
export interface LegalizarAvanceCommand {
  id: number;
  valorLegalizado: number;
  urlDocumentoLegalizacion?: string | null;
  observaciones?: string | null;
}
