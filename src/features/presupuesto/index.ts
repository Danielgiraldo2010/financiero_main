// features/presupuesto/index.ts
// Barrel público del dominio Presupuesto UE (FE4)
// Las rutas importan los componentes de página desde aquí.

// ── Páginas (importadas por las rutas) ───────────────────────────────────
export { PresupuestoIndexPage }    from './ui/PresupuestoIndexPage'
export { PresupuestoIngresosPage } from './ingresos/listar/ui/PresupuestoIngresosPage'
export { PresupuestoGastosPage }   from './gastos/listar/ui/PresupuestoGastosPage'
export { EtapasPresupuestoPage }   from './etapas/listar/ui/EtapasPresupuestoPage'
export { EjecucionMensualPage }    from './ejecucion-mensual/listar/ui/EjecucionMensualPage'

// ── Types públicos (usados por FE5+) ─────────────────────────────────────
export type {
  LineaIngresoResponse,
  LineaGastoResponse,
  PresupuestoLineasParams,
  ResumenEjecucionPresupuestal,
  TechoPresupuestalResponse,
  EtapaAprobacionResponse,
  EjecucionMensualResponse,
} from './model/types'

// ── Query keys (para invalidaciones desde FE5+) ──────────────────────────
export { presupuestoKeys } from './model/queryKeys'

// ── Hooks públicos ────────────────────────────────────────────────────────
export { useResumenPresupuesto } from './resumen/hook'
export { useTechoPresupuestal }  from './techo/listar/hook'
