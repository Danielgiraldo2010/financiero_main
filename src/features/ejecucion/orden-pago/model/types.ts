// features/ejecucion/orden-pago/model/types.ts
// Fuente: OpenAPI v1.json — schemas OrdenPagoResponse, RegistrarOpCommand, ConfirmarPagoOpCommand

export type EstadoOP = 'PENDIENTE' | 'PAGADO' | 'ANULADO';

export interface OrdenPagoResponse {
  id: number;
  numero: string;
  fechaOrden: string;              // ISO date-time
  vigencia: number;
  registroPresupuestalId: number;
  rpNumero: string;
  valor: number;
  beneficiario: string | null;
  nitCedula: string | null;
  estado: EstadoOP;
  fechaPago: string | null;        // ISO date-time, null hasta confirmar
  comprobantePago: string | null;
  concepto: string | null;
}

/** POST /api/v1/ejecucion/op */
export interface RegistrarOpCommand {
  registroPresupuestalId: number;
  fechaOrden: string;              // ISO date-time
  valor: number;
  beneficiario: string;
  nitCedula: string;
  concepto?: string | null;
  urlDocumento?: string | null;
}

/** POST /api/v1/ejecucion/op/{id}/confirmar — ACCIÓN IRREVERSIBLE */
export interface ConfirmarPagoOpCommand {
  id: number;
  fechaPago: string;               // ISO date-time
  comprobantePago: string;
  urlSoportePago?: string | null;
}
