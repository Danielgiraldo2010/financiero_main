// --- Model ------------------------------------------------------------------
export * from "./model/types"
export * from "./model/queryKeys"
export * from "./model/constants"

// --- Listar -----------------------------------------------------------------
export { useNormatividad }       from "./listar/hook"
export { NormatividadPage }      from "./listar/ui/NormatividadPage"
export { NormatividadFilters }   from "./listar/ui/NormatividadFilters"

// --- Registrar --------------------------------------------------------------
export { useRegistrarNorma }     from "./registrar/hook"
export { RegistrarNormaDialog }  from "./registrar/ui/RegistrarNormaDialog"

// --- Detalle ----------------------------------------------------------------
export { useNormaDetalle }       from "./detalle/hook"
export { NormaDetailPage }       from "./detalle/ui/NormaDetailPage"

// --- Actualizar -------------------------------------------------------------
export { useActualizarNorma }       from "./actualizar/hook"
export { ActualizarNormaDialog }    from "./actualizar/ui/ActualizarNormaDialog"

// --- Derogar ----------------------------------------------------------------
export { useDerogarNorma }       from "./derogar/hook"
export { DerogarNormaDialog }    from "./derogar/ui/DerogarNormaDialog"

// --- Suspender / Reactivar --------------------------------------------------
export { useSuspenderNorma }     from "./suspender/hook"
export { useReactivarNorma }     from "./reactivar/hook"

// --- Por dominio ------------------------------------------------------------
export { useNormasPorDominio }   from "./por-dominio/hook"
export { getNormasPorDominio }   from "./por-dominio/api"

// --- Procesos de norma ------------------------------------------------------
export { useAgregarProcesoNorma, useEliminarProcesoNorma } from "./procesos/hook"
