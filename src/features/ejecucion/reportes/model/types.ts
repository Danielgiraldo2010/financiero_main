// features/ejecucion/reportes/model/types.ts
// Fuente: OpenAPI v1.json — schemas de ReportesEjecucion.
// IMPORTANTE: SeguimientoCdp reutiliza CdpResponse de fe_09a, no hay tipo propio.

// ---------- Ejecución por Rubro ----------
// Devuelto por GET /api/v1/ejecucion/reportes/por-rubro
// Fuente real: PagedResultOfEjecucionMensualResponse
export interface EjecucionMensualRow {
  id:                    number;
  rubroId:               number;
  codigoCcp:             string;
  rubroNombre:           string;
  tipoGasto:             string;
  unidadEjecutora:       string;
  presupuestoDefinitivo: number;
  totalComprometido:     number;
  totalEjecutado:        number;
  saldoDisponible:       number;
  porcentajeEjecucion:   number;
  totalCdp:              number;
  totalRp:               number;
  totalOp:               number;
}

// ---------- Alertas ----------
// Devuelto por POST /api/v1/ejecucion/reportes/generar-alertas
export interface AlertaResponse {
  id: number;
  vigencia: number;
  rubroGastoId: number;
  rubroGastoNombre: string;
  umbralAlerta: number;
  mensaje: string;
  fechaAlerta: string | null;      // ISO date-time
  estado: string;
  destinatario: string | null;
  unidadEjecutoraId: number | null;
  unidadEjecutoraNombre: string | null;
}

// Command para generar alertas — un solo campo requerido según OpenAPI
export interface GenerarAlertasCommand {
  vigencia: number;
}

// ---------- Parámetros de consulta ----------
export interface ReporteSeguimientoCdpParams {
  vigencia: number;
  estado?: string;
  pagina?: number;
  tamanoPagina?: number;
}

export interface ReporteEjecucionPorRubroParams {
  vigencia: number;
  mes?: number;
  pagina?: number;
  tamanoPagina?: number;
}
