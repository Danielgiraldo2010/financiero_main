// features/ejecucion/model/types.ts
// Tipos compartidos de la feature de Ejecución Presupuestal.
// Fuente de verdad: OpenAPI v1.json — no modificar sin actualizar el schema.

export type EstadoCDP =
  | 'ACTIVO'
  | 'COMPROMETIDO'
  | 'AGOTADO'
  | 'ANULADO';

export type EstadoRP =
  | 'ACTIVO'
  | 'PARCIALMENTE_PAGADO'
  | 'PAGADO'
  | 'ANULADO';

/** Fila de CDP tal como la devuelve el backend (ListarCdp / ConsultarCdp). */
export interface CdpResponse {
  id: number;
  numero: string;
  fechaExpedicion: string;           // ISO date-time
  vigencia: number;
  unidadEjecutoraId: number;
  unidadEjecutoraNombre: string;
  rubroGastoId: number;
  rubroGastoNombre: string;
  fuenteRecursoId: number;
  fuenteRecursoNombre: string;
  valorSolicitado: number | null;
  valorAprobado: number;
  valorComprometidoRp: number;
  valorReintegrado: number;
  saldoDisponible: number;
  estado: EstadoCDP;
  beneficiario: string | null;
  descripcion: string | null;
  objeto: string | null;
}

/** Command para generar un nuevo CDP. */
export interface GenerarCdpCommand {
  vigencia: number;
  unidadEjecutoraId: number;
  rubroGastoId: number;
  fuenteRecursoId: number;
  valorSolicitado: number;
  beneficiario: string;
  objeto?: string | null;
  descripcion?: string | null;
  urlDocumento?: string | null;
}

/** Command para anular un CDP (motivo ≥ 20 chars validado en frontend y backend). */
export interface AnularCdpCommand {
  id: number;
  motivo: string;
}

/** Command para verificar disponibilidad presupuestal. */
export interface VerificarDisponibilidadCommand {
  vigencia: number;
  rubroGastoId: number;
  fuenteRecursoId: number;
  valorSolicitado: number;
}

/** Respuesta de verificación de disponibilidad presupuestal. */
export interface DisponibilidadResponse {
  vigencia: number;
  rubroGastoId: number;
  rubroNombre: string;
  fuenteRecursoId: number;
  fuenteNombre: string;
  disponible: number;
  valorSolicitado: number;
  esValido: boolean;
  mensaje: string;
}

/** Fila de RP tal como la devuelve el backend. */
export interface RegistroPresupuestalResponse {
  id: number;
  numero: string;
  fechaRegistro: string;             // ISO date-time
  vigencia: number;
  cdpId: number;
  cdpNumero: string;
  rubroGastoId: number;
  rubroGastoNombre: string;
  valorTotal: number;
  valorPagado: number;
  saldoPendiente: number;
  porcentajeEjecutado: number;
  beneficiario: string | null;
  nitCedula: string | null;
  estado: EstadoRP;
  numeroOrdenesPago: number;
}

/** Command para generar un Registro Presupuestal. */
export interface GenerarRpCommand {
  cdpId: number;
  valorTotal: number;
  beneficiario: string;
  nitCedula: string;
  descripcion?: string | null;
  urlDocumento?: string | null;
}

/**
 * Saldo de un RP.
 * IMPORTANTE: el schema real (OpenAPI) expone saldoPendiente + porcentajeEjecutado,
 * NO saldoDisponible + saldoComprometido como podría indicar el nombre del endpoint.
 */
export interface SaldoRpResponse {
  registroPresupuestalId: number;
  saldoPendiente: number;
  porcentajeEjecutado: number;
}
