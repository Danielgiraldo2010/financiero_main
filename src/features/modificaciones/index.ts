// Barrel de exports públicos del dominio modificaciones
export { ModificacionesPage }     from './listar/ui/ModificacionesPage'
export { ModificacionDetailPage } from './detalle/ui/ModificacionDetailPage'

export { useModificaciones } from './listar/hook'
export { useModificacion }   from './detalle/hook'

export type {
  SolicitudModificacion,
  SolicitudModificacionResumen,
  EstadoModificacion,
  LineaModificacion,
  TimelineEvento,
} from './model/types'
