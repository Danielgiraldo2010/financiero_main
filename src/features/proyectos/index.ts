// ─── Proyectos Especiales — Barrel ──────────────────────────────────────────
// Re-exporta los puntos de entrada públicos de la feature.
// Los sub-módulos (presupuesto, contratos, cartera) tienen sus propios barrels.

export { ProyectosPage }          from './listar/ui/ProyectosPage'
export { ProyectoDetailPage }     from './detalle/ui/ProyectoDetailPage'
export { useProyectos }           from './listar/hook'
export { useProyecto }            from './detalle/hook'
export { useRegistrarProyecto }   from './registrar/hook'
export { useModificarProyecto }   from './modificar/hook'
export { useAnularProyecto }      from './anular/hook'
export { useProyectoTimeline }    from './timeline/hook'
export { proyectosKeys }          from './model/queryKeys'
export type { Proyecto, EstadoPresupuesto, TipoProyecto, ListarProyectosParams } from './model/types'
