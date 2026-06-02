// features/ejecucion/cdp/model/types.ts
// Re-exporta los tipos de CDP desde el modelo compartido para que los
// sub-módulos (listar, generar, detalle, anular, verificar) importen
// desde un único lugar local.
export type {
  CdpResponse,
  GenerarCdpCommand,
  AnularCdpCommand,
  VerificarDisponibilidadCommand,
  DisponibilidadResponse,
  EstadoCDP,
} from '../../model/types';
