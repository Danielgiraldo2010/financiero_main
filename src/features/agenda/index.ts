// --- Model ------------------------------------------------------------------
export * from "./model/types"
export * from "./model/queryKeys"
export * from "./model/constants"

// --- Mi Agenda --------------------------------------------------------------
export { useMiAgenda }          from "./mi-agenda/hook"
export { MiAgendaPage }         from "./mi-agenda/ui/MiAgendaPage"

// --- Listar -----------------------------------------------------------------
export { useEventosAgenda }     from "./listar/hook"
export { EventosAgendaPage }    from "./listar/ui/EventosAgendaPage"

// --- Detalle ----------------------------------------------------------------
export { useEventoAgenda }      from "./detalle/hook"

// --- Crear ------------------------------------------------------------------
export { useCrearEventoAgenda } from "./crear/hook"
export { CrearEventoDialog }    from "./crear/ui/CrearEventoDialog"

// --- Actualizar -------------------------------------------------------------
export { useActualizarEventoAgenda } from "./actualizar/hook"
export { ActualizarEventoDialog }    from "./actualizar/ui/ActualizarEventoDialog"

// --- Completar --------------------------------------------------------------
export { useCompletarEventoAgenda } from "./completar/hook"
export { CompletarEventoDialog }    from "./completar/ui/CompletarEventoDialog"

// --- Cancelar ---------------------------------------------------------------
export { useCancelarEventoAgenda }  from "./cancelar/hook"
export { CancelarEventoDialog }     from "./cancelar/ui/CancelarEventoDialog"

// --- Asignaciones -----------------------------------------------------------
export {
  useAsignacionesEvento,
  useAgregarAsignacionEvento,
  useEliminarAsignacionEvento,
  useMarcarVistoAsignacion,
} from "./asignaciones/hook"
