// ─────────────────────────────────────────────────────────────────────────────
// SAR — Servicios Académicos Remunerados (Acuerdo 44/2017)
// ─────────────────────────────────────────────────────────────────────────────

export type SarEstado =
  | 'BORRADOR'
  | 'APROBADO'
  | 'CON_CDP'
  | 'EJECUTADO'
  | 'ANULADO';

export interface Sar {
  id: number;
  vigencia: number;
  proyectoId: number;
  proyectoNombre: string;
  empleadoId: number;
  empleadoNombreCompleto: string;
  tipoEmpleado: string;
  tipoSar: string;
  descripcion: string;
  horasAprobadas: number;
  horasEjecutadas: number;
  valorHora: number;
  valorTotalAprobado: number;
  valorTotalEjecutado: number;
  fuenteFinanciacion: string;
  numeroResolucionDec: string | null;
  fechaResolucion: string | null;
  cdpId: number | null;
  cdpNumero: string | null;
  estado: SarEstado;
  urlResolucion: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Viáticos — Tarifas
// ─────────────────────────────────────────────────────────────────────────────

export interface TarifaViatico {
  id: number;
  vigencia: number;
  tipoPersonal: string;
  zona: string;
  municipioTipo: string;
  incluyePernoctacion: boolean;
  horasMinimasDict: number | null;
  valorDiaCompleto: number;
  valorMedioDia: number;
  valorTransporte: number;
  normaAplicable: string;
  vigenteDesde: string;
  vigenteHasta: string | null;
  estado: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Viáticos — Cálculo previo
// ─────────────────────────────────────────────────────────────────────────────

export interface CalculoViatico {
  tarifaIdAplicada: number;
  tipoPersonal: string;
  zona: string;
  municipioTipo: string;
  incluyePernoctacion: boolean;
  diasViaje: number;
  valorDiaCompleto: number;
  valorMedioDia: number;
  valorTransporte: number;
  valorTotalCalculado: number;
  normaAplicable: string;
  detalleCalculo: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Viáticos — Solicitudes
// ─────────────────────────────────────────────────────────────────────────────

export type ViaticoEstado =
  | 'BORRADOR'
  | 'APROBADO'
  | 'CON_CDP'
  | 'LIQUIDADO'
  | 'ANULADO';

export interface ViaticoSolicitud {
  id: number;
  vigencia: number;
  proyectoId: number;
  proyectoNombre: string;
  unidadEjecutoraId: number;
  empleadoId: number;
  empleadoNombreCompleto: string;
  tipoPersonal: string;
  tarifaId: number | null;
  municipioDestinoId: number;
  municipioDestinoNombre: string;
  fechaSalida: string;
  fechaRegreso: string;
  diasViaje: number;
  incluyePernoctacion: boolean;
  horasEfectivasDict: number | null;
  valorCalculado: number;
  valorAprobado: number;
  cdpId: number | null;
  cdpNumero: string | null;
  estado: ViaticoEstado;
  numeroResolucion: string | null;
  observaciones: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Resumen dashboard
// ─────────────────────────────────────────────────────────────────────────────

export interface ResumenSarViaticos {
  vigencia: number;
  totalSarBorrador: number;
  totalSarAprobados: number;
  totalSarConCdp: number;
  totalSarEjecutados: number;
  montoTotalSarAprobado: number;
  montoTotalSarEjecutado: number;
  totalViaticosBorrador: number;
  totalViaticosAprobados: number;
  totalViaticosConCdp: number;
  totalViaticosLiquidados: number;
  montoTotalViaticosAprobado: number;
  montoTotalViaticosCalculado: number;
}
