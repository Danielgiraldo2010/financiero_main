// features/ejecucion/radicacion/model/types.ts
// Fuente: OpenAPI — RadicacionCuentaResponse, RegistrarRadicacionCommand,
//         RechazarRadicacionCommand (AprobarRadicacionCuenta no tiene body propio)

export type EstadoRadicacion = 'RADICADA' | 'APROBADA' | 'RECHAZADA';

export interface RadicacionCuentaResponse {
  id: number;
  numeroRadicado: string;
  fechaRadicacion: string;         // ISO date-time
  vigencia: number;
  tipoCuenta: string;
  proveedorNombre: string;
  proveedorNit: string | null;
  concepto: string;
  valorBruto: number;
  valorRetenciones: number;
  valorNeto: number;               // calculado en backend: valorBruto - valorRetenciones
  cdpId: number | null;
  cdpNumero: string | null;
  registroPresupuestalId: number | null;
  rpNumero: string | null;
  estado: EstadoRadicacion;
  radicadoPor: string | null;
  revisadoPor: string | null;
  fechaRevision: string | null;    // ISO date-time
}

/**
 * POST /api/v1/ejecucion/radicacion
 * valorNeto NO se envía — lo calcula el backend.
 */
export interface RegistrarRadicacionCommand {
  vigencia: number;
  unidadEjecutoraId: number;
  tipoCuenta: string;
  proveedorNombre: string;
  proveedorNit?: string | null;
  concepto: string;
  valorBruto: number;
  valorRetenciones: number;
  cdpId?: number | null;
  registroPresupuestalId?: number | null;
  observaciones?: string | null;
  urlDocumento?: string | null;
}

/** POST /api/v1/ejecucion/radicacion/{id}/rechazar */
export interface RechazarRadicacionCommand {
  id: number;
  motivo: string;
}
