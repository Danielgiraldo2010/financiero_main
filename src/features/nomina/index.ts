// ─── Barrel principal del dominio Nómina ─────────────────────────────────────
// FE7-A: empleados + puntos salariales
// FE7-B: plan de clases + horas dictadas
// FE7-C: costos parafiscales + liquidación + liquidación GH + conciliación

// Modelo raíz
export type {
  Empleado, TipoEmpleado, EstadoEmpleado,
  PuntoSalarial,
  PlanClases, EstadoPlanClases,
  HorasDictadas,
  PagedResult,
} from './model/types'

export {
  TIPO_EMPLEADO_LABELS,
  TIPO_EMPLEADO_OPTIONS,
  TIPOS_EMPLEADO_PLAN_CLASES,
} from './model/constants'

export { nominaKeys } from './model/queryKeys'

// ── FE7-A ──────────────────────────────────────────────────────────────────
export { useEmpleados }           from './empleados/listar/hook'
export { useRegistrarEmpleado }   from './empleados/registrar/hook'
export { useDesactivarEmpleado }  from './empleados/desactivar/hook'
export { EmpleadosPage }          from './empleados/listar/ui/EmpleadosPage'

export { usePuntosSalariales }           from './puntos-salariales/listar/hook'
export { useRegistrarPuntosSalariales }  from './puntos-salariales/registrar/hook'
export { PuntosSalarialesPage }          from './puntos-salariales/listar/ui/PuntosSalarialesPage'

// ── FE7-B ──────────────────────────────────────────────────────────────────
export { usePlanClases }           from './plan-clases/listar/hook'
export { useRegistrarPlanClases }  from './plan-clases/registrar/hook'
export { useCerrarPlanClases }     from './plan-clases/cerrar/hook'
export { PlanClasesPage }          from './plan-clases/listar/ui/PlanClasesPage'

export { useRegistrarHorasDictadas } from './horas-dictadas/registrar/hook'
export { HorasTable }                from './horas-dictadas/listar/ui/HorasTable'

// ── FE7-C ──────────────────────────────────────────────────────────────────
export { useCostosParafiscales }         from './costos-parafiscales/listar/hook'
export { useCargarCostosParafiscales }   from './costos-parafiscales/cargar/hook'
export { ParafiscalesPage }              from './costos-parafiscales/listar/ui/ParafiscalesPage'

export { useLiquidaciones }       from './liquidacion/listar/hook'
export { useLiquidarNomina }      from './liquidacion/liquidar/hook'
export { useConfirmarPagoNomina } from './liquidacion/confirmar-pago/hook'
export { LiquidacionPage }        from './liquidacion/listar/ui/LiquidacionPage'

export { useIniciarConciliacion } from './conciliacion/iniciar/hook'
export { ConciliacionPage }       from './conciliacion/ui/ConciliacionPage'
