// ─── Cohortes ────────────────────────────────────────────────────────────────
export { useCohortes } from "./cohortes/listar/hook"
export { useRegistrarCohorte } from "./cohortes/registrar/hook"
export { useModificarCohorte } from "./cohortes/modificar/hook"
export { useAnularCohorte } from "./cohortes/anular/hook"
export { useResumenMatriculas } from "./cohortes/resumen/hook"
export { CohortesList } from "./cohortes/listar/ui/CohortesList"
export { RegistrarCohorteDialog } from "./cohortes/registrar/ui/RegistrarCohorteDialog"
export { ModificarCohorteDialog } from "./cohortes/modificar/ui/ModificarCohorteDialog"
export { AnularCohorteDialog } from "./cohortes/anular/ui/AnularCohorteDialog"
export { ResumenMatriculasPage } from "./cohortes/resumen/ui/ResumenMatriculasPage"

// ─── Transferencias ───────────────────────────────────────────────────────────
export { useTransferencias } from "./transferencias/listar/hook"
export { useRegistrarTransferencia } from "./transferencias/registrar/hook"
export { useConfirmarRecepcion } from "./transferencias/confirmar/hook"
export { ConfirmarRecepcionDialog } from "./transferencias/confirmar/ui/ConfirmarRecepcionDialog"

// ─── Cobertura PIC ────────────────────────────────────────────────────────────
export { useCoberturasPic } from "./cobertura-pic/listar/hook"
export { useRegistrarCoberturaPic } from "./cobertura-pic/registrar/hook"
export { useConfirmarGiroPic } from "./cobertura-pic/confirmar-giro/hook"
export { RegistrarCoberturaDialog } from "./cobertura-pic/registrar/ui/RegistrarCoberturaDialog"
export { ConfirmarGiroDialog } from "./cobertura-pic/confirmar-giro/ui/ConfirmarGiroDialog"

// ─── Becas Posgrado ───────────────────────────────────────────────────────────
export { useBecasPosgrado } from "./becas-posgrado/listar/hook"
export { useRegistrarBecaPosgrado } from "./becas-posgrado/registrar/hook"
export { useRegistrarTransferenciaUE } from "./becas-posgrado/transferir-ue/hook"
export { RegistrarBecaDialog } from "./becas-posgrado/registrar/ui/RegistrarBecaDialog"
export { RegistrarTransferenciaUEDialog } from "./becas-posgrado/transferir-ue/ui/RegistrarTransferenciaUEDialog"

// ─── Model ────────────────────────────────────────────────────────────────────
export * from "./model/types"
export * from "./model/constants"
export { matriculasKeys } from "./model/queryKeys"
export {
  RegistrarCohorteSchema,
  RegistrarTransferenciaSchema,
  ConfirmarRecepcionSchema,
  RegistrarCoberturaSchema,
  ConfirmarGiroSchema,
  RegistrarBecaSchema,
  RegistrarTransferenciaBecaSchema,
} from "./model/schema"
