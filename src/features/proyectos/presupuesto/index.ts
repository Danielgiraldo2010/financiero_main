// presupuesto/index.ts
// Barrel export del sub-dominio presupuesto.

// Model
export * from "./model/types"
export * from "./model/queryKeys"

// Hooks públicos
export { useIniciarPresupuesto } from "./iniciar/hook"
export { useLineasPresupuesto, useAgregarIngreso, useAgregarGasto } from "./lineas/hook"
export {
  useRevisar,
  useSolicitarAprobacion,
  useAprobarDecano,
  useAprobarPlaneacion,
  useConsolidar,
} from "./aprobaciones/hook"

// UI pública (importada en ProyectoDetailPage via FE3-A placeholder)
export { PresupuestoProyectoTab } from "./lineas/ui/PresupuestoProyectoTab"
export { AprobacionesPanel } from "./aprobaciones/ui/AprobacionesPanel"
export { ConsolidarDialog } from "./aprobaciones/ui/ConsolidarDialog"
